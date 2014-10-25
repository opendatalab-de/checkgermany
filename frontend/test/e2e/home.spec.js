describe("home", function () {
    var ptor = protractor.getInstance();

    it("should display the correct title", function () {
        ptor.get('/');
        expect(ptor.getTitle()).toBe('Check Germany');
    });
});