var app = angular.module("myApp", []);

app.controller("LoginController", function ($scope, $http, $window) {
  $scope.username = "";
  $scope.password = "";

  $scope.login = function () {
    var data = {
      tenTaiKhoan: $scope.username,
      matKhau: $scope.password,
    };

    $http.post("http://localhost:8080/auth/login", data).then(
      function (response) {
        toastr.success("Đăng nhập thành công", "Thông báo");
        $window.location.href = "../index.html"; // Điều hướng sau khi đăng nhập thành công
      },
      function (error) {
        if (error.status === 401) {
          toastr.error("Sai thông tin tài khoản hoặc mật khẩu", "Thông báo");
        } else {
          toastr.error("Đã xảy ra lỗi. Vui lòng thử lại sau!", "Thông báo");
        }
      }
    );
  };
});
