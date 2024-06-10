import express from "express"; // Importerar express för att skapa servern
import ejs from "ejs"; // Importerar ejs för att använda som template-motor
import { format } from "date-fns"; // Importerar format från date-fns för att formatera datum

const app = express(); // Skapar en express-applikation
const port = 3000; // Definierar vilken port servern ska lyssna på

app.use(express.static("public")); // Tjänstgör statiska filer från "public" katalogen
app.use(express.urlencoded({ extended: true })); // För att tolka URL-encoded request bodies

// Skapar ett specifikt datum och formaterar det
let specificDate = new Date(2024, 5, 7); 
let formattedSpecificDate = format(specificDate, "dd.MM.yyyy");

// Skapar dagens datum och formaterar det
let date = new Date();
let formattedDate = format(date, "dd.MM.yyyy");

// Definierar en lista med senaste inlägg
let latestPosts = [
  {
    title: "Write Like You Talk",
    content: "Here's a simple trick for getting more people to read what you write: write in spoken language.",
    createdAt: formattedSpecificDate,
  },
  {
    title: "The Top of My Todo List",
    content: "Don't ignore your dreams; don't work too much; say what you think; cultivate friendships; be happy.",
    createdAt: formattedSpecificDate,
  },
];

// Route för att rendera startsidan
app.get("/", (req, res) => {
  const editPost = null; // Ingen post redigeras
  res.render("index.ejs", { latestPosts, editPost }); // Skickar latestPosts och editPost till index.ejs
});

// Route för att rendera sidan med en specifik post för redigering
app.get("/editpost/:index", (req, res) => {
  const postIndex = req.params.index; // Hämtar index för posten som ska redigeras
  const editPost = { ...latestPosts[postIndex], index: postIndex }; // Skapar en kopia av posten och lägger till index
  res.render("index.ejs", { latestPosts, editPost }); // Skickar latestPosts och editPost till index.ejs
});

// Route för att hantera skapandet av ett nytt inlägg
app.post("/newpost", (req, res) => {
  const newPost = {
    title: req.body.title, // Hämtar titeln från formuläret
    content: req.body.content, // Hämtar innehållet från formuläret
    createdAt: formattedDate, // Sätter skapandedatum till dagens datum
  };

  latestPosts.unshift(newPost); // Lägger till det nya inlägget i början av listan

  res.redirect("/"); // Omdirigerar användaren till startsidan efter att inlägget har lagts till
});

// Route för att hantera uppdateringen av ett befintligt inlägg
app.post("/updatepost/:index", (req, res) => {
  const postIndex = req.params.index; // Hämtar index för posten som ska uppdateras
  latestPosts[postIndex].title = req.body.title; // Uppdaterar postens titel
  latestPosts[postIndex].content = req.body.content; // Uppdaterar postens innehåll

  res.redirect("/"); // Omdirigerar användaren till startsidan efter att inlägget har uppdaterats
});

// Route för att hantera borttagningen av ett inlägg
app.post("/deletepost/:index", (req, res) => {
  const postIndex = req.params.index; // Hämtar index för posten som ska raderas
  latestPosts.splice(postIndex, 1); // Tar bort inlägget från listan

  res.redirect("/"); // Omdirigerar användaren till startsidan efter att inlägget har raderats
});

// Startar servern och lyssnar på definierad port
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
