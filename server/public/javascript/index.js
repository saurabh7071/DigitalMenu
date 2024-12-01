document.addEventListener('DOMContentLoaded', () => {
    const sidemenu = document.querySelectorAll('.nav-link');
    let defaultActiveItem = document.getElementById('dashboard');  // Define defaultActiveItem in the appropriate scope

    // Function to remove the "active" class from all menu items
    function removeActiveClass() {
        sidemenu.forEach(link => {
            link.classList.remove('active');
        });
    }

    sidemenu.forEach(item => {
        item.addEventListener('click', (event) => {
            removeActiveClass();  // Remove active class from all menu items
         
            // Add "active" class to the clicked menu item
            item.classList.add('active');

            // Store the active item in local storage
            localStorage.setItem('activeNavItem', item.id);

             // Smooth scroll to the target section
             const targetId = event.target.getAttribute('href').substring(1);
             const targetElement = document.getElementById(targetId);
             if (targetElement) {
                 targetElement.scrollIntoView({ behavior: 'smooth' });
             }

        });
    });

    // Set the "Dashboard" navigation item as active based on local storage
    const activeNavItem = localStorage.getItem('activeNavItem');
    if (activeNavItem) {
        defaultActiveItem = document.getElementById(activeNavItem);  // Assign the value to defaultActiveItem
        defaultActiveItem.classList.add('active');
    }
});


