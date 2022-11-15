categoryBtns.forEach((categoryBtn, index) => {
    categoryBtn.addEventListener('click', (e) => {
        // dark mode button
        if (index === 0) {
            categoryBtn.classList.toggle('dark');
            document.querySelector('body').classList.toggle('dark');
            dark_mode = !dark_mode;

            create_popup(`✔ 深色模式: ${dark_mode}`, COLOR.SUCCESS);

            return;
        }

        // add button
        if (index === 1) {
            toggle_mask();
            addForm_popup();

            return;
        }

        const has_subBar = [5, 14, 20, 25];
        // category buttons
        if (has_subBar.indexOf(index) + 1) {
            for (let i = 0; i < has_subBar.length; i++) {
                if (has_subBar[i] === index) {
                    continue;
                }

                categoryBtns[has_subBar[i]].nextElementSibling.classList.remove('show');
            }

            categoryBtn.nextElementSibling.classList.toggle('show');
            return;
        }

        categoryBtns.forEach(categoryBtn => categoryBtn.classList.remove('select'));
        sub_sidebars.forEach(sub_sidebar => sub_sidebar.classList.remove('show'));

        categoryBtn.classList.add('select');

        if ([6, 7, 8, 9, 10, 11, 12, 13].indexOf(index) + 1) {
            categoryBtns[has_subBar[0]].classList.add('select');
        }

        if ([15, 16, 17, 18, 19].indexOf(index) + 1) {
            categoryBtns[has_subBar[1]].classList.add('select');
        }

        if ([21, 22, 23, 24].indexOf(index) + 1) {
            categoryBtns[has_subBar[2]].classList.add('select');
        }

        if ([26, 27].indexOf(index) + 1) {
            categoryBtns[has_subBar[3]].classList.add('select');
        }

        storage_info.querySelector('.info-title').innerHTML = categoryBtn.querySelector('.bubbleText').innerHTML;
        view_category = categoryBtn.getAttribute('tagName');

        update_data(view_category);
    });
});