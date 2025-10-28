## Motivera ditt val av databas
MongoDB är en NoSQL-databas, vilket innebär att den inte kräver en fast schema som traditionella SQL-databaser gör. Detta gör det enkelt att ändra datamodellen när applikationen utvecklas. Eftersom MongoDB inte kräver ett strikt schema kan jag som utvecklare snabbt iterera på datamodeller och lägga till nya fält utan att störa andra delar av applikationen.

## Redogör vad de olika teknikerna (ex. verktyg, npm-paket, etc.) gör i applikationen
Jag har valt att ta med **bcryptjs** för att få hjälp med att kryptera lösenord till användare av säkerhetsskäl. Jag har även tagit med npm paketet **dotenv** för att kunna skapa en .env - fil för att säkrare bevara databas-strängen. Paketet **mongoose** är till för att lättare skapa models och arbeta med mongoDB. Paketet **nodemon** kollar efter ändringar och startar servern efter ändringarna.


## Redogör översiktligt hur applikationen fungerar
Applikationen gör det möjligt att skapa och hantera användare och uppgifter i ett projekt. Genom att använda MongoDB lagras data om användare och uppgifter på ett effektivt sätt. Användare kan tilldelas uppgifter, och när uppgifter är klara (status = "done"), registreras slutdatumet. API:et är byggt för att vara robust, med validering, felhantering och säker hantering av känslig information som lösenord.
