function calculateProportion(feedbacks) {
    const noFeedbacks = feedbacks.length
    const noPositiveFeedbacks = (feedbacks.filter(e => e.reaction === "bullish").length * 100 / noFeedbacks).
    toFixed()
    const noNegativeFeedbacks = 100 - noPositiveFeedbacks
    return [noPositiveFeedbacks , noNegativeFeedbacks]
}

export {calculateProportion}