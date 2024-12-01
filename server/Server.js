
const express = require("express");
const session = require('express-session');
const path = require("path");
const crypto = require('crypto');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);
const hbs = require("hbs");
const multer = require('multer');
const Handlebars = require('handlebars');
require("./database/connection");

// Generate a random secret key
const secretKey = crypto.randomBytes(32).toString('hex');
console.log("Generated Secret Key:", secretKey);

const user = require("./models/registerUsers");
const Category = require("./models/category");
const MyCategory = require('./models/categoryCount');
const MenuItem = require('./models/MenuItems');
const Image = require('./models/ImgUploader');
const UserNew = require('./models/UserMenu_SignUp');
const Order = require('./models/order');

const PORT = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../server/public");
const templates_path = path.join(__dirname, "../server/templates/views");
const partials_path = path.join(__dirname, "../server/templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);

// Use the 'express-session' middleware
app.use(session({
    secret: secretKey, 
    resave: false,
    saveUninitialized: true,
}));

Handlebars.registerHelper('formatCurrency', function (value) {
    return value.toFixed(2);
});

// ============ Admin Login Page ================
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/login", (req, res) => {
    res.render("login");
})
app.post("/login", async (req, res) => {
    try {
        // const check = await user.findOne({ email: req.body.email })
        // if (check.password === req.body.password) {
        //     res.status(201).render("Home");
        // } else {
        //     res.send("Invalid login Details");
        // }
        const {email,password} = req.body;
        const userModel = await user.findOne({email});
        if (!userModel || userModel.password !== password) {
            return res.send("Invalid login details");
        }
        // Store user's session upon successful login
        req.session.user = userModel;
        // Pass user data to the Home template
        res.render("Home");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
})

// ============== Admin Registration Page ===============
app.get("/index", (req, res) => {
    res.render("index");
})

app.post("/index", async (req, res) => {

    const data = {
        Restaurant_name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }
    await user.insertMany([data])
    res.render("login")

    // try {
    //     const { name, email, password } = req.body;
    //     const newUser = new user({ Restaurant_name: name, email, password });
    //     await newUser.save();
    //     res.render("login");
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).send("Internal Server Error");
    // }

});

// =========== Home Page =============
app.get("/Home", async (req, res) => {
    try {
        const categories = await Category.find();
        const categoryCount = await MyCategory.countDocuments(); // Update this line
        const orders = await Order.find();

        res.render("home", { categories, categoryCount, orders });
    } catch (error) {
        res.status(500).send("Error in Fetching");
    }
})


app.get('/getCategoryCount', async (req, res) => {
    try {
        const categoryCount = await Category.countDocuments();
        res.json({ categoryCount });
    } catch (error) {
        console.error('Error fetching category count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getMenuItemCount', async (req, res) => {
    try {
        const menuItemCount = await MenuItem.countDocuments();
        res.json({ menuItemCount });
    } catch (error) {
        console.error('Error fetching menu item count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getorderCount', async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();
        res.json({ OrderCount: orderCount });
    } catch (error) {
        console.error('Error fetching order count:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// ==============  Categories Page =================
app.get("/categories", async (req, res) => {
    try {
        const categories = await Category.find();
        const categoryCount = categories.length; // Get the count of categories
        res.render("categories", { categories, categoryCount });
    } catch (error) {
        res.status(500).send("Error Fetching Categories.");
    }
})

app.delete('/deleteCategory/:id', async (req, res) => {
    const categoryId = req.params.id;
    try {
        await Category.findByIdAndDelete(categoryId);
        const categories = await Category.find();  // Retrieve the updated category list
        res.json({ success: true, categories });   // Send back the updated categories
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Error deleting category.' });
    }
});

app.get("/Categories_add", (req, res) => {
    res.render("Categories_add");
})

app.post("/Categories_add", async (req, res) => {
    const { title, description } = req.body;

    try {
        const category = new Category({ title, description });
        await category.save();
        console.log('Category added:', category);
        res.send('Category added Successfully.');
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Error adding category.');
    }
});

// ================ Menu_Dishes Page ==================
app.get("/Menu_Dishes", async (req, res) => {
    try {
        const MenuItems = await MenuItem.find();
        // Convert binary image data to base64 for each menu item
        MenuItems.forEach(item => {
            item.base64Image = item.image.data.toString('base64');
        });
        res.render("Menu_Dishes", { MenuItems });

    } catch (error) {
        res.status(500).send('Error Fetching Menu Items:', error);
    }
})

app.delete('/deleteMenuItem/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        const deletedItem = await MenuItem.findByIdAndDelete(itemId);
        if (deletedItem) {
            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Menu item not found.' });
        }
    } catch (error) {
        console.error('Error deleting menu item:', error);
        res.status(500).json({ success: false, error: 'Failed to delete item. Please try again later.' });
    }
});

app.get("/Menu_Dishes_add", async (req, res) => {
    try {
        // Fetch categories from your database
        const categories = await Category.find();
        res.render("menu_dishes_add", { categories });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Error rendering Menu_Dishes_add page.');
    }
})

// Define storage for uploaded files
const storage = multer.memoryStorage(); // Store as binary data in memory
// Initialize multer with the defined storage
const upload = multer({ storage: storage });

app.post("/Menu_Dishes_add", upload.single('image'), async (req, res) => {
    const { title, description, price, size } = req.body;
    const image = req.file;
    const categoryID = req.body.category;
    if (!image) {
        return res.status(400).send('No image file provided. Please select an image to upload.');
    }

    try {
        const category = await Category.findById(categoryID);
        if (!category) {
            return res.status(400).send('Invalid Category Selected.');
        }
        const newItem = new MenuItem({
            title, description, price, size,
            category: category.title,
            image: {
                data: image.buffer,
                contentType: image.mimetype,
            },
        });
        await newItem.save();
        console.log('Item added:', newItem);
        res.send('Item added successfully.');
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Error adding New Item.');
    }
});

app.get("/Orders", async (req, res) => {
    try {
        // Fetch all orders from the database
        const orders = await Order.find();

        // Render the Orders page with the fetched orders
        res.render("orders", { orders });
    } catch (error) {
        console.error('Error Fetching Orders:', error);
        res.status(500).send('Error fetching orders.');
    }
})

app.get("/Messages", (req, res) => {
    res.render("messages");
})

app.get("/QR_Code", (req, res) => {
    res.render("QR_Code");
})


app.get("/ImgUploader", async (req, res) => {
    try {
        const images = await Image.find();
        images.forEach(img => {
            img.base64Image = img.image.data.toString('base64');
        });
        res.render("ImgUploader", { images });
    } catch (error) {
        res.status(500).send('Error Fetching Image:', error);
    }

})


app.delete('/deleteImage/:id', async (req, res) => {
    const imageId = req.params.id;
    try {
        const deletedImage = await Image.findByIdAndDelete(imageId);

        if (deletedImage) {
            // Get the latest image after deletion
            const latestImage = await Image.findOne().sort({ updatedAt: -1 });

            if (latestImage) {
                latestImageIdentifier = latestImage.title;
            } else {
                latestImageIdentifier = null; // No images left
            }

            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, error: 'Image not found.' });
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ success: false, error: 'Failed to delete image. Please try again later.' });
    }
});

app.put('/updateImage/:id', upload.single('image'), async (req, res) => {
    const imageId = req.params.id;
    const newTitle = req.body.title;
    const newImage = req.file;

    try {
        const existingImage = await Image.findById(imageId);

        if (!existingImage) {
            return res.status(404).json({ success: false, error: 'Image not found.' });
        }

        // Update the title if needed
        if (newTitle) {
            existingImage.title = newTitle;
        }

        // Update the image if a new image was uploaded
        if (newImage) {
            existingImage.image.data = newImage.buffer;
            existingImage.image.contentType = newImage.mimetype;
        }

        await existingImage.save();

        // Send a success response with the updated image
        res.status(200).json({ success: true, updatedImage: existingImage });
    } catch (error) {
        console.error('Error updating image:', error);
        res.status(500).json({ success: false, error: 'Failed to update image. Please try again later.' });
    }
});


// When rendering ImgUploader_add for editing
app.get('/ImgUploader_add', async (req, res) => {
    const itemId = req.query.id;
    try {
        const item = await Image.findById(itemId);
        if (item) {
            item.base64Image = `data:${item.image.contentType};base64,${item.image.data.toString('base64')}`;
        }
        res.render('ImgUploader_add', { item });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching image for editing.');
    }
});


let latestImageIdentifier = null;
app.post("/ImgUploader_add", upload.single('image'), async (req, res) => {
    const title = req.body.title;
    const image = req.file;
    if (!image) {
        return res.status(400).send('No image file provided. Pleaes select an image to upload.');
    }

    try {
        const newImage = new Image({
            title,
            image: {
                data: image.buffer,
                contentType: image.mimetype,
            },
        });

        await newImage.save();
        latestImageIdentifier = newImage.title;
        console.log('Image is Uploaded :', newImage);
        res.send('Image Uploaded Successfully');
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send('Error to Upload Image.');
    }
})

app.get("/UserMenu", async (req, res) => {
    try {
        const categories = await Category.find();
        const MenuItems = await MenuItem.find();

        MenuItems.forEach(item => {
            item.base64Image = item.image.data.toString('base64');
        });
        if (latestImageIdentifier) {
            const latestImage = await Image.findOne({ title: latestImageIdentifier });

            if (latestImage) {
                latestImage.base64Image = `data:${latestImage.image.contentType};base64,${latestImage.image.data.toString('base64')}`;
                console.log(categories);
                res.render("UserMenu", { categories, latestImage, MenuItems });
            } else {
                res.render("UserMenu", { categories, MenuItems, latestImage: null });
            }
        } else {
            res.render("UserMenu", { latestImage: null, MenuItems: null });
        }
    } catch (error) {
        console.error('Error fetching categories for UserMenu:', error);
        console.error('Error fetching menu items for UserMenu:', error);
        res.status(500).send('Error fetching menu items for UserMenu.');
        res.status(500).send('Error fetching categories for UserMenu.');
    }
});

app.get("/Order_Details", (req, res) => {
    res.render("Order_Details");
});

app.post('/Order_Details', async (req, res) => {
    try {
        const { name, PhoneNumber, email, TableNumber, items, totalPrice } = req.body;

        // items is already parsed as an array, no need for JSON.parse
        const order = new Order({
            name,
            PhoneNumber,
            email,
            TableNumber,
            items,
            totalPrice,
        });

        await order.save();

        // Clear the cart after successful order submission
        // localStorage.removeItem("cart");

        // Redirect to a success page or send a success response
        res.status(201).send('Order submitted successfully.');
    } catch (error) {
        console.error('Error submitting order:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get("/UserMenu_loginpage", (req, res) => {
    res.render("UserMenu_loginpage");
});

app.post("/UserMenu_loginpage", async (req, res) => {
    try {
        // const { email, password } = req.body;

        // Check if the user exists
        const user = await UserNew.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send('User not found. Please check your email and try again.');
        }

        // Check if the password is correct
        if (user.password === req.body.password) {
            return res.status(201).render("UserMenu");
        } else {
            res.send("Invalid login Details");
        }

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/UserMenu_SignUp", (req, res) => {
    res.render("UserMenu_SignUp");
});

app.post("/UserMenu_SignUp", async (req, res) => {
    const { username, phonenumber, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await UserNew.findOne({ email });

        if (existingUser) {
            return res.status(400).send('User with this email already exists.');
        }

        // Create a new user
        const newUser = new UserNew({ username, phonenumber, email, password });
        await newUser.save();
        res.render("UserMenu_loginpage");
        // res.status(201).send('User registered successfully.');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/signout', (req, res) => {
    // Destroy the user's session to sign them out
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        // Redirect the user to the login page after signing out
        res.redirect('/login');
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});





















