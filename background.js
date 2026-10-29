const starsContainer = document.getElementById('stars-container');
    const starCount = 50;

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.classList.add('star');

      const topOffset = Math.random() * 130 + 'vh';
      const fallDuration = (Math.random() * 10 + 5) + 's';
      const fallDelay = (Math.random() * 10) + 's';

      star.style.setProperty('--top-offset', topOffset);
      star.style.setProperty('--fall-duration', fallDuration);
      star.style.setProperty('--fall-delay', fallDelay);

      starsContainer.appendChild(star);
    }