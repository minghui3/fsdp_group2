const moment = require('moment');
const { cache } = require('../cache');
const testCaseSummary = async (req,res) =>{
    try{
        //get test cases from cache 
        const recentActivities = cache
        const totalTestCases = recentActivities.length;

        const passedTestCases = recentActivities.filter(test => test.result === 'Passed').length;
        const failedTestCases = totalTestCases - passedTestCases;
        //get current and last months
        const currentMonth = moment().month();
        const lastMonth = moment().subtract(1, 'months').month();

        const currentMonthActivities = recentActivities.filter(test => moment(test.date).month() === currentMonth);
        const passedCurrentMonth = currentMonthActivities.filter(test => test.result === 'Passed').length;
        const failedCurrentMonth = currentMonthActivities.length - passedCurrentMonth;

        const lastMonthActivities = recentActivities.filter(test => moment(test.date).month() === lastMonth);
        const passedLastMonth = lastMonthActivities.filter(test => test.result === 'Passed').length;
        const failedLastMonth = lastMonthActivities.length - passedLastMonth;

        
        const testCaseData = {
            totalTestCase: {
              total: totalTestCases,
              passed: passedTestCases,
              failed: failedTestCases,
            },
            currentMonth: {
              total: currentMonthActivities.length,
              passed: passedCurrentMonth,
              failed: failedCurrentMonth,
            },
            lastMonth: {
              total: lastMonthActivities.length,
              passed: passedLastMonth,
              failed: failedLastMonth,
            }
        }
        return res.json(testCaseData);
    }
    catch(err){
        return res.status(500).json({message : "Error fetching test case data"});
    }
}
module.exports = { testCaseSummary};