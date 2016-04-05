module ZacTrac.Layout {
    class ViewModel {
        constructor(private $mdSidenav) {

        }

        toggleSidebar() {
            this.$mdSidenav('left').toggle();
        }
    }

    addAngularState("layout", null, null, ViewModel, "layout/layout.html");
}
