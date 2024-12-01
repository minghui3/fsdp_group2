const parseTestResult = (data) => {
    return {
        tests: data.uuid.map(test => ({
            id: test.id,
            name: test.name,
            keyword: test.keyword,
            uri: test.uri,
            scenarios: test.elements.map(scenario => ({
                type: scenario.type,
                keyword: scenario.keyword,
                steps: scenario.steps.map(step => ({
                    result: step.result,
                    match: step.match
                })),
                start_timestamp: scenario.start_timestamp, 
                name: scenario.name,
                before: scenario.before?.map(step => ({
                    result: step.result,
                    match: step.match, 
                })),
                after: scenario.after?.map(step => ({
                    result: step.result,
                    match: step.match,
                }))
            })),
        }))
    }
}

module.exports = parseTestResult;