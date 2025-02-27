function createGetAllVersionsHandler(anchorFactory) {
    return function (request, response, next) {

        const anchorID = request.params.anchorId;

        require("../anchoring/getAllVersionsSmartContract")(anchorFactory.contract, anchorID, (err, result) => {
            if (err) {
                console.log("response getAllVersions 500", anchorID);
                return response.status(500).send(err);
            }
            console.log("response getAllVersions 200", anchorID, result);
            return response.status(200).send(JSON.stringify(result));
        });
    }
}

module.exports = createGetAllVersionsHandler;