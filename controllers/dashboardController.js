const moment = require('moment');
const testResultController = require('./testResultController');
const getDashboard = async (req,res) =>{
    const recentData = await testResultController.fetchAllResults();
    const formattedData = recentData.map(result =>{
        result.date = new Date(result.date).toISOString().split('T')[0];
        return result;
    })
    const passCount = recentData.filter(test => test.result === 'Passed').length;
    const failCount = recentData.filter(test => test.result === 'Failed').length;

    const dateForLast10Days = Array.from({ length: 10 }, (_, i) =>
        moment().subtract(9 - i, 'days').format('YYYY-MM-DD')
    );

    const passCountForLast10Days = dateForLast10Days.map(date =>
        formattedData.filter(test => test.date === date && test.result === 'Passed').length
    );

    const failCountForLast10Days = dateForLast10Days.map(date =>
        formattedData.filter(test => test.date === date && test.result === 'Failed').length
    );

    // 3 look for most recently failed test
    const recentFailedRecord = recentData
        .filter(test => test.result === "Failed")
        .sort((a,b) => new Date(b.date) - new Date(a.date))
        .at(0);
    // Construct the response object


    const responseData = {
        doughnut: { 
            passCount, failCount 
        },
        
        lineGraph: {
        dateForLast10Days,
        passCount: passCountForLast10Days,
        failCount: failCountForLast10Days,
        },
        recentFailedTests: {
           failingTests: recentFailedRecord
        }
    };

    res.json(responseData);
}
module.exports = {getDashboard};