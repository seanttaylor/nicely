/* istanbul ignore file */

/**
 * Mock implementation for various fetch methods
 */
async function mockFetchImplementation() {
    async function json(data) {
        return {
            documentSentiment: {
                score: 0.9,
                magnitude: 0.9
            }
        };
    }

    return {
        json
    }
}

module.exports = mockFetchImplementation;