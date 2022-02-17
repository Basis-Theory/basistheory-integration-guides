document.addEventListener('DOMContentLoaded', function() {
    const sidebarClassCategories = ['getting-started', 'concepts', 'guides', 'reference'];

    sidebarClassCategories.forEach((sidebarClassCategory) => {
        const categoryNameAndIcon = document.querySelector(`#${sidebarClassCategory}-category-name-and-icon`);

        categoryNameAndIcon.addEventListener('click', function() {
            const categoryExpander = document.querySelector(`#${sidebarClassCategory}-category-expander`);
            categoryExpander.classList.toggle('rotate');
            const categoryItems = document.querySelector(`#${sidebarClassCategory}-category-items`);

            categoryItems.classList.toggle('open');
        });
    });

    sidebarClassCategories.forEach((sidebarClassCategory) => {
        if (document.location.pathname.includes(sidebarClassCategory) || document.location.pathname === '/') {
            const categoryExpander = document.querySelector(`#${sidebarClassCategory}-category-expander`);
            const categoryItems = document.querySelector(`#${sidebarClassCategory}-category-items`);

            categoryExpander.classList.toggle('rotate');
            categoryItems.classList.toggle('open')
        }
    });
});
