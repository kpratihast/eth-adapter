const express = require('express');



function requestBodyJSONMiddleware(request, response, next) {
    /**
     * Prepare headers for response
     */
    response.setHeader('Content-Type', 'application/json');

    const data = [];

    request.on('data', (chunk) => {
        data.push(chunk);
    });

    request.on('end', () => {
        let jsonBody = {};
        try {
            jsonBody = data.length ? JSON.parse(data) : {};
        } catch (err) {
            console.log(err);
        }
        request.body = jsonBody;
        next();
    });
}

function configureHeaders(webServer) {
    webServer.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, X-Content-Length');
        res.setHeader('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Content-Length, X-Content-Length');
        next();
    });

}

function configureCreateAnchorEntryPoints(webServer, config) {
    const factory = require('./anchoring/anchorFactory');
    const anchorFactory = new factory(config.rpcAddress, config.contractAddress, config.abi, config.accountPrivateKey);
    const createAnchorHandler = require("./controllers/createAnchor")(anchorFactory, config.account);
    webServer.use("/createAnchor/*", requestBodyJSONMiddleware);
    webServer.put("/createAnchor/:anchorId/:anchorValue", createAnchorHandler);
}

function configureAppendAnchorEntryPoints(webServer, config) {
    const factory = require('./anchoring/anchorFactory');
    const anchorFactory = new factory(config.rpcAddress, config.contractAddress, config.abi, config.accountPrivateKey);
    const appendAnchorHandler = require("./controllers/appendAnchor")(anchorFactory, config.account);
    webServer.use("/appendAnchor/*", requestBodyJSONMiddleware);
    webServer.put("/appendAnchor/:anchorId/:anchorValue", appendAnchorHandler);
}

function configureCreateOrAppendMultipleAnchorsEntryPoints(webServer, config) {
    const factory = require('./anchoring/anchorFactory');
    const anchorFactory = new factory(config.rpcAddress, config.contractAddress, config.abi, config.accountPrivateKey);
    const createOrUpdateMultipleAnchorsHandler = require("./controllers/createOrUpdateMultipleAnchors")(anchorFactory, config.account);
    webServer.use("/createOrAppendMultipleAnchors/*", requestBodyJSONMiddleware);
    webServer.put("/createOrAppendMultipleAnchors/*", createOrUpdateMultipleAnchorsHandler);
}

function configureGetAllVersionsEntryPoints(webServer, config) {
    const factory = require('./anchoring/anchorFactory');
    const anchorFactory = new factory(config.rpcAddress, config.contractAddress, config.abi, config.accountPrivateKey);
    const getAllVersionsHandler = require("./controllers/getAllVersions")(anchorFactory);
    webServer.use("/getAllVersions/*", requestBodyJSONMiddleware);
    webServer.get("/getAllVersions/:anchorId", getAllVersionsHandler);
}

function configureGetLastVersionEntryPoints(webServer, config) {
    const factory = require('./anchoring/anchorFactory');
    const anchorFactory = new factory(config.rpcAddress, config.contractAddress, config.abi, config.accountPrivateKey);
    const getLastVersionHandler = require("./controllers/getLastVersion")(anchorFactory);
    webServer.use("/getLastVersion/*", requestBodyJSONMiddleware);
    webServer.get("/getLastVersion/:anchorId", getLastVersionHandler);
}

function configureTotalNumberOfAnchorsEntryPoints(webServer, config) {
    const factory = require('./anchoring/anchorFactory');
    const anchorFactory = new factory(config.rpcAddress, config.contractAddress, config.abi, config.accountPrivateKey);
    const totalNumberOfAnchors = require("./controllers/totalNumberOfAnchors")(anchorFactory);
    webServer.use("/totalNumberOfAnchors/*", requestBodyJSONMiddleware);
    webServer.get("/totalNumberOfAnchors/*", totalNumberOfAnchors);
}

function configureDumpAnchorsEntryPoints(webServer, config) {
    const factory = require('./anchoring/anchorFactory');
    const anchorFactory = new factory(config.rpcAddress, config.contractAddress, config.abi, config.accountPrivateKey);
    const dumpAnchors = require("./controllers/dumpAnchors")(anchorFactory);
    webServer.use("/dumpAnchors/*", requestBodyJSONMiddleware);
    webServer.get("/dumpAnchors/*", dumpAnchors);
}

module.exports = function () {
    const port = 3000;
    const config = require("./utils/config");
    new config((err, result) => {
        if (err)
        {
            console.log(err);
            process.exit(1);
        }
        const scConfig = result;
        console.log("Configuration file used at runtime : ", scConfig);
        this.webServer = express();

        this.webServer.listen(port);

        configureHeaders(this.webServer);

        configureCreateAnchorEntryPoints(this.webServer, scConfig);
        configureAppendAnchorEntryPoints(this.webServer, scConfig);
        configureCreateOrAppendMultipleAnchorsEntryPoints(this.webServer, scConfig);
        configureGetAllVersionsEntryPoints(this.webServer, scConfig);
        configureGetLastVersionEntryPoints(this.webServer, scConfig);
        configureTotalNumberOfAnchorsEntryPoints(this.webServer, scConfig);
        configureDumpAnchorsEntryPoints(this.webServer, scConfig);
        console.log('Server started. Listening on ', port);
        return this;
    });

};
