window.onload = function () {
    // dark mode
     if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
         document.querySelector('.categoryBtn').classList.add('dark');
         document.querySelector('body').classList.toggle('dark');
         dark_mode = true;
     }

    // loading data
    update_data('templates');
}