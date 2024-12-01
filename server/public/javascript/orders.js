const Orders = [
  {
    TableNumber: "1",
    Name: "Saurabh",
    Email: "saurabh@gmail.com",
    MobileNumber: "9373725589",
  },
  {
    TableNumber: "2",
    Name: "Palak",
    Email: "palak@gmail.com",
    MobileNumber: "9373719089",
  },
  {
    TableNumber: "3",
    Name: "Sanskruti",
    Email: "sansu@gmail.com",
    MobileNumber: "9673456980",
  },
  {
    TableNumber: "4",
    Name: "Neha",
    Email: "neha@gmail.com",
    MobileNumber: "9389562390",
  },
  {
    TableNumber: "5",
    Name: "Rajnandan",
    Email: "raj@gmail.com",
    MobileNumber: "7677722010",
  },
  {
    TableNumber: "6",
    Name: "Abhay",
    Email: "abhi@gmail.com",
    MobileNumber: "9145672388",
  },
]


// fill orders in table 
Orders.forEach(order =>{
  const tr = document.createElement('tr');
  const trContent = `
                      <td>${order.TableNumber}</td>
                      <td>${order.Name}</td>
                      <td>${order.Email}</td>
                      <td>${order.MobileNumber}</td>
                      <td><a href="#">Details</a></td> 
                      `;
  tr.innerHTML = trContent;
  document.querySelector('table tbody').appendChild(tr);
});