if (typeof window !== 'undefined') {
    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        const tab = button.getAttribute('data-tab');


        document.querySelectorAll('.tab-button').forEach(btn => {
          btn.classList.remove('active');
        });
        button.classList.add('active');


        document.querySelectorAll('.tab-content').forEach(content => {
          content.classList.remove('active');
        });
        document.querySelector(`.tab-content[data-tab="${tab}"]`)!.classList.add('active');
      });
    });
  }