function openWindow(id) {
            document.getElementById(id).style.display = 'flex';
        }

        function closeWindow(id) {
            document.getElementById(id).style.display = 'none';
        }

        const systemsToCheck = [
            { name: "TrueNAS", url: "http://192.168.178.77" },
            { name: "Netbook", url: "http://192.168.178.147" }  
        ];

        async function checkSystems() {
            let offlineCount = 0;
            let widget = document.getElementById('status-widget');
            let text = document.getElementById('status-text');

            for (let sys of systemsToCheck) {
                let isOnline = false;
                try {
                    await fetch(sys.url, { mode: 'no-cors', cache: 'no-store' });
                    isOnline = true;
                } catch (e) {
                    isOnline = false;
                }
                if (!isOnline) offlineCount++;
            }

            if (offlineCount === 0) {
                widget.className = "status-card normal";
                text.innerText = "ALLE SYSTEME ONLINE";
            } else if (offlineCount === 1) {
                widget.className = "status-card warning";
                text.innerText = "WARNUNG: 1 SYSTEM OFFLINE";
                playAlarm();
            } else {
                widget.className = "status-card alert";
                text.innerText = "KRITISCH: BEIDE SYSTEME TOT!";
                playAlarm();
            }
        }
        let alarmInterval = null;
        function playAlarm() {
            if (alarmInterval) return;

            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            function playSirenCycle() {
             const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();

                osc.type = 'sawtooth'; 

                osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(2, audioCtx.currentTime + 0.25);

                osc.connect(gain);
                gain.connect(audioCtx.destination);

                osc.start();
                osc.stop(audioCtx.currentTime + 1);
             }
    playSirenCycle();
    alarmInterval = setInterval(playSirenCycle, 1000);
     }
function stopAlarm() {
    if (alarmInterval) {
        clearInterval(alarmInterval);
        alarmInterval = null;
    }
}
    setInterval(checkSystems, 1000);
    checkSystems();