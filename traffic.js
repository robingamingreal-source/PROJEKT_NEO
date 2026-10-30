async function getTrueNASNetworkCombined() {
    const nodes = [
        { ip: '192.168.178.147', key: '2-mih7vhz0UM7y8u4yKbZQOYvkhYnVxcUeATVX1w015ZlGP0JVa8Vsj3ecmx3OSSkk' },
        { ip: '192.168.178.77', key: '1-LghsRBlohSOXBFHdGAzcJTYB8EzV2dInCxH4Vc1O9xOkM4NXIZepLGIWwNYDekmJ' }
    ];

    let totalRx = 0;
    let totalTx = 0;

    for (const node of nodes) {
        try {
            const response = await fetch(`http://${node.ip}/api/v2.0/interface`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${node.key}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error(`Fehler bei ${node.ip}: ${response.status}`);

            const interfaces = await response.json();
            interfaces.forEach(iface => {
                if (iface.link_state === "UP" && iface.stats) {
                    totalRx += iface.stats.received_bytes || 0;
                    totalTx += iface.stats.sent_bytes || 0;
                }
            });

        } catch (error) {
            console.error(`Konnte Daten von ${node.ip} nicht abrufen:`, error);
        }
    }

    console.log(`Gesamt Netzwerk - Download (RX): ${totalRx} Bytes, Upload (TX): ${totalTx} Bytes`);
    

}

setInterval(getTrueNASNetworkCombined, 2000);