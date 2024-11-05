app.controller("ChiTietSanPhamController", function ($scope, $http) {
  // GET: lấy dữ liệu từ API và lưu vào $scope.nhanViens
  // Gọi API để lấy chi tiết sản phẩm theo ID
  $http
    .get("http://localhost:8080/chitietsanpham/1")
    .then(function (response) {
      $scope.chiTietSanPhams = response.data;
      console.log(response.data); // Kiểm tra dữ liệu trả về từ API
    })
    .catch(function (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      $scope.chiTietSanPhams = []; // Xóa dữ liệu cũ nếu có lỗi
      alert("Không tìm thấy chi tiết sản phẩm với ID này.");
    });
});
