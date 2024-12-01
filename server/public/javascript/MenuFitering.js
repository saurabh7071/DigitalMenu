 // JavaScript for menu filtering
 const menuItems = document.querySelectorAll(".dashboard-menu a");
 const cards = document.querySelectorAll(".dashboard-card");

 menuItems.forEach(item => {
     item.addEventListener("click", function () {
         const category = item.getAttribute("data-category");

         // Remove "active" class from all menu items
         menuItems.forEach(menuItem => {
             menuItem.classList.remove("active");
         });

         // Add "active" class to the clicked menu item
         item.classList.add("active");

         filterCards(category);
     });
 });

 function filterCards(category) {
     cards.forEach(card => {
         const cardCategory = card.parentElement.parentElement.id;
         if (category === "all" || category === cardCategory) {
             card.style.display = "block";
         } else {
             card.style.display = "none";
         }
     });
 }