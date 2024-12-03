const parseTestResult = (data) => {
    return {
        tests: data.map(test => ({
            id: test.id,
            name: test.name,
            keyword: test.keyword,
            uri: test.uri,
            scenarios: test.elements.map(scenario => ({
                type: scenario.type,
                keyword: scenario.keyword,
                steps: scenario.steps.map(step => ({
                    result: step.result,
                    match: {
                        location: step.match.location,
                        arguments: step.match.arguments?.map(arg => arg.val),
                    },
                })),
                start_timestamp: scenario.start_timestamp, 
                name: scenario.name,
                before: scenario.before?.map(step => ({
                    result: step.result,
                    match: {
                        location: step.match.location,
                        arguments: step.match.arguements?.map(arg => arg.val),
                    }, 
                })),
                after: scenario.after?.map(step => ({
                    result: step.result,
                    match: {
                        location: step.match.location,
                        arguments: step.match.arguments?.map(arg => arg.val),
                    }, 
                }))
            })),
        }))
    }
}

module.exports = parseTestResult;