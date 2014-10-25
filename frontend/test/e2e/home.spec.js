describe("test", function () {
    var ptor = protractor.getInstance();
    describe("start", function () {
        it("should display the correct title", function () {
            ptor.get('/');
            expect(ptor.getTitle()).toBe('Angular Bootstrap APP');
        });
    });
});