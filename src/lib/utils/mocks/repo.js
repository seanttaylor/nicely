/**
 * Mock implementation for various Repository methods
 * See /src/interfaces and /src/lib/repository for documentation and actual implementation
 */
const mockRepositoryImplementation = {
    _repo: {
        incrementCommentCount() {
            this.calledMethods.incrementCommentCountCalled = true;
        },
        incrementLikeCount() {
            this.calledMethods.incrementLikeCountCalled = true;
        },
        calledMethods: {
            incrementCommentCountCalled: false,
            incrementLikeCountCalled: false
        }
    },
    _data: {
        commentCount: 47,
        likeCount: 47
    },

};

module.exports = mockRepositoryImplementation;
