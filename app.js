const express = require("express");
const path = require("path");
const app = express();
app.use(express.json());
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname,"cricketTeam.db");
let db = null;

const initializeDBAndServer = async()=>{
    try {
        db = await open({
                        filename : dbPath,
                        driver : sqlite3.Database,
        });
        app.listen(3000,()=>{
                console.log("Server Running at http://localhost:3000/");
        });
    }
    catch(e){
        console.log(`DB Error : ${e.message}`);
        process.exit(1);
    }
};
initializeDBAndServer();
//get players from cricket_team table
app.get("/players/",async(request, response)={
    const getPlayersQuery = `SELECT * FROM cricket_team ORDER BY player_id; `;
    const playersArray = await db.all(getPlayersQuery);
    response.send(playersArray);
});

//posting a new player in cricket_team table 

app.post("/players/",async(request, response)=>{
    const playerDetails = request.body;
    const {playerName,jerseyNumber,role} = playerDetails;
    const addPlayerQuery = `INSERT INTO cricket_team (playerName,jerseyNumber,role) 
                            VALUES(`${playerName}`,`${jerseyNumber}`,`${role}`);`;
    const dbResponse = db.run(addPlayerQuery);
    const playerId = dbResponse.lastId;
    response.send("Player Added To Team");
});

//getting a player deatils based on id from cricket_team table

app.get("/players/:playerId",async(request, response)=>{
    const {playerId} = request.params;
    const getPlayerQuery = `SELECT * FROM cricket_team WHERE  playerId = {playerId}`;
    const player = await db.get(getPlayerQuery);
    response.send(player);
});

//updating player details in the table 

qpp.put("/players/:playerId",async(request,response)={
        const {playerId} = request.params;
        const playerDetails = request.body;
        const{playerName,jerseyNumber,role}= playerDetails;
        const updatePlayerQuery = `UPDATE cricket_team SET 
        playerName = `${playerName}`,jerseyNumber=`${jerseyNumber}`,role =`${role}` WHERE playerId = ${playerId};`;

        await db.run(updatePlayerQuery);
        response.send("PLayer Details Updated");
});

//deleting a player from the cricket_team table 

app.delete("/players/:playerId",async(request, response)=>{
    const {playerId} = request.params;
    const deletePlayerQuery = `DELETE FROM cricket_team WHERE playerId = ${playerId}; `;
    await db.run(deletePlayerQuery);
    response.send("Player Removed");
});