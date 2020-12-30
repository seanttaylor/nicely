/**
 * Entry point for bootstrapping application in the ci/cd/test environment
 */

 /* istanbul ignore file */
require("dotenv").config();
const globalConfig = require("../config");
const http = require("http");
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const events = require("events");
const eventEmitter = new events.EventEmitter();
const fetch = require("node-fetch");
const mockFetch = require("../src/lib/utils/mocks/fetch");
const mockConsole = require("../src/lib/utils/mocks/console");
const DatabaseConnector = require("../src/lib/database/connectors/memory"); 
const asiagoDatabaseConnector = new DatabaseConnector({
    console: mockConsole
});
const serverPort = process.env.SERVER_PORT || 3000;

/********************************SERVICES**************************************/
/**UserService**/
const { UserService } = require("../src/services/user");
const UserRepository = require("../src/lib/repository/user/json");
const IUserRepository = require("../src/interfaces/user-repository");
const usersRepo = new IUserRepository(new UserRepository(asiagoDatabaseConnector));
const userService = new UserService(usersRepo);

/**PostService**/
const { PostService } = require("../src/services/post");
const PostRepository = require("../src/lib/repository/post/json");
const IPostRepository = require("../src/interfaces/post-repository");
const postsRepo = new IPostRepository(new PostRepository(asiagoDatabaseConnector));
const postService = new PostService({
    repo: postsRepo,
    userService,
    eventEmitter
});

/**CommentService**/
const { CommentService } = require("../src/services/comment");
const CommentRepository = require("../src/lib/repository/comment/json");
const ICommentRepository = require("../src/interfaces/comment-repository");
const commentsRepo = new ICommentRepository(new CommentRepository(asiagoDatabaseConnector));
const commentService = new CommentService({
    repo: commentsRepo,
    userService,
    postService,
    eventEmitter
});

/**PublishService**/
const IPublisher = require("../src/interfaces/publisher");
const SSEPublisher = require("../src/lib/publisher/sse");
const ssePublishService = new IPublisher(new SSEPublisher(eventEmitter));

/**CacheService**/
const ICache = require("../src/interfaces/cache");
const CacheService = require("../src/lib/cache");
const cacheService = new ICache(new CacheService());

/**AuthService**/
const AuthService = require("../src/services/auth");
const authService = new AuthService({cacheService, userService});

/**MailService**/
const IMailer = require("../src/interfaces/mailer");
const MailService = require("../src/services/mail");
const mailLib = require("../src/lib/utils/mocks/mailer"); 
const mailService = new IMailer(new MailService({console: mockConsole, eventEmitter}, mailLib));

/**SentimentAnalysisService**/
const SentimentAnalysisService = require("../src/lib/sentiment-analysis");
const ISentimentAnalysisService = require("../src/interfaces/sentiment-analysis");
const sentimentAnalysisService = new ISentimentAnalysisService(new SentimentAnalysisService({
    eventEmitter, 
    fetch: mockFetch,
    console
}));

/******************************************************************************/

const SSERouter = require("../src/api/sse");
const StatusRouter = require("../src/api/status");
const PostRouter = require("../src/api/post");
const UserRouter = require("../src/api/user");
const FeedRouter = require("../src/api/feed");
const CommentRouter = require("../src/api/comment");
const UIApplicationRouter = require("../src/api/ui");

app.set("view engine", "ejs");

//app.use(helmet());
app.use(cors());
app.use(morgan(globalConfig.application.morgan.verbosity, {
    skip: globalConfig.application.morgan.requestLoggingBehavior
  }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("dist"));

/**Routes**/
app.use("/status", StatusRouter());
app.use("/api/v1/posts", PostRouter(postService));
app.use("/api/v1/users", UserRouter({
    postService, 
    userService, 
    commentService,
    authService,
    eventEmitter
}));
app.use("/api/v1/feed", FeedRouter(postService));
app.use("/api/v1/feed/realtime-updates", SSERouter(ssePublishService));
app.use("/api/v1/comments", CommentRouter(commentService));

app.use("/", UIApplicationRouter());

app.use((req, res, next) => {
    //console.error(`Error 404 on ${req.url}.`);
    res.status(404).send({ status: 404, error: "NOT FOUND" });
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const msg = err.error || err.message;
    console.error(err);
    res.status(status).send({ status, error: "There was an error." });
});

if (process.env.NODE_ENV !== "ci/cd/test") {
    http.createServer(app).listen(serverPort, () => {
        console.info(globalConfig.launchBanner);
        console.info(
            "Application listening on port %d (http://localhost:%d)",
            serverPort,
            serverPort
        );
    });
}

module.exports = app;
