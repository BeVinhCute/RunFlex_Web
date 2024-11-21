var app = angular.module("myApp", []);

app.controller("OrderController", function ($scope, $http) {
  $scope.orders = []; // Mảng lưu trữ đơn hàng
  $scope.selectedOrder = null; // Lưu trữ đơn hàng được chọn

  // Hàm để lấy tất cả đơn hàng từ API
  $scope.getAllOrders = function () {
    $http.get("http://localhost:8080/hoadon").then(
      function (response) {
        // Lấy dữ liệu từ backend và gán vào mảng orders
        $scope.orders = response.data;
      },
      function (error) {
        toastr.error("Không thể tải danh sách đơn hàng.");
      }
    );
  };

  // Hàm tạo 5 đơn hàng trống
  $scope.addFiveEmptyOrders = function () {
    // Kiểm tra số lượng đơn hàng (giới hạn là 5 đơn hàng)
    if ($scope.orders.length < 5) {
      for (let i = 0; i < 5; i++) {
        // Call the correct endpoint (without a path variable)
        $http.post("http://localhost:8080/hoadon/hoadontrong", {}).then(
          function (response) {
            // Nếu tạo thành công, thêm đơn hàng vào mảng
            $scope.orders.push(response.data);
            toastr.success("Đã thêm 1 đơn hàng trống!");
          },
          function (error) {
            toastr.error("Không thể tạo đơn hàng.");
          }
        );
      }
    } else {
      toastr.warning("Chỉ được tạo tối đa 5 đơn hàng!");
    }
  };

  // Hàm để xem chi tiết đơn hàng
  $scope.viewOrder = function (order) {
    // Chọn đơn hàng để hiển thị chi tiết
    $scope.selectedOrder = order;
  };

  // Hàm để thêm sản phẩm vào đơn hàng
  $scope.addProductToOrder = function (order) {
    // Logic thêm sản phẩm vào đơn hàng (có thể thêm API call ở đây)
    toastr.info("Sản phẩm đã được thêm vào đơn hàng.");
  };

  // Hàm để thanh toán đơn hàng
  $scope.payOrder = function (order) {
    // Logic thanh toán đơn hàng (có thể thêm API call ở đây)
    toastr.success("Đơn hàng đã được thanh toán!");
  };
});
