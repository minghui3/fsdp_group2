const {getDB} = require('../database/db');
const {cache} = require('../cache');
const getAllResults = async (req, res) => {
    try {
        const dataResultsArray = await fetchAllResults();
        const formattedResultsArray = dataResultsArray.map(result => {
            // Format the date to YYYY-MM-DD
            result.date = new Date(result.date).toISOString().split('T')[0];
            return result;
        });
        res.status(200).json(formattedResultsArray);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

//meant for cache
async function fetchAllResults() {
    const db = getDB();
    const collection = db.collection("test_results_chrome");
    const dataResults = await collection.find().toArray();
    
    // Process data as needed
    if (!dataResults) throw new Error("No data found");

    let dataResultsArray = [];
    dataResults.forEach((record) => {
        if (record.uuid && Array.isArray(record.uuid)){
            record.uuid.forEach((item) => {
                item.elements.forEach((element) => {
                    if (element.type === "scenario" && element.steps && Array.isArray(element.steps)) {
                        let result = element.steps.some(step => step.result.status === "failed") ? "Failed" : "Passed";
                        dataResultsArray.push({ id: generateUniqueId(), name: element.name, executedBy: "auto", date: element.start_timestamp, result });
                    }
                });
            });
        }
    })
    cache.length = 0;
    cache.push(...dataResultsArray);
    return dataResultsArray;
}
function generateUniqueId() {
    const generatedIds = new Set();
    let uniqueId;
    
    do {
        uniqueId = Math.floor(1000 + Math.random() * 9000); 
    } while (generatedIds.has(uniqueId));
    
    generatedIds.add(uniqueId);
    
    return uniqueId;
}
module.exports = {getAllResults, fetchAllResults};