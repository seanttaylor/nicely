function Card({createdDate, body, likeCount, commentCount, handle}) {
    return `<div class="ui card centered">
                <div class="content">
                    <div class="right floated meta">${createdDate}</div>
                        <img src="https://placehold.it/50" alt="Placeholder image" class="ui avatar image"/>
                        ${handle}
                    </div>
                <div class="image">
                    <img src="https://placehold.it/150" alt="Placeholder image">
                </div>
                <div class="content">
                    <span class="post-body">${body}</span>
                    <span class="right floated"><i class="heart outline like icon"></i>${likeCount} likes</span>
                    <i class="comment icon"></i>
                        ${commentCount} comments
                </div>
                <div class="extra content">
                    <div class="ui large transparent left icon input">
                        <i class="heart outline icon"></i>
                        <input type="text" placeholder="Add Comment">
                    </div>
                </div>
            </div>`
}

module.exports = Card;