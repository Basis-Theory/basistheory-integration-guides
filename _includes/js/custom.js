document.addEventListener('DOMContentLoaded', function() {
    const sidebarClassCategories = ['getting-started', 'concepts', 'guides', 'reference'];

    sidebarClassCategories.forEach((sidebarClassCategory) => {
        const categoryExpander = document.querySelector(`#${sidebarClassCategory}-category-expander`);

        categoryExpander.addEventListener('click', function() {
            categoryExpander.classList.toggle('rotate');
            const categoryItems = document.querySelector(`#${sidebarClassCategory}-category-items`);

            categoryItems.classList.toggle('open');
        });
    })
});
