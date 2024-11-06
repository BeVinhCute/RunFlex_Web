var app = angular.module("myApp", []);

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

app.controller("chiTietSanPhamController", function ($scope, $http, $location) {
  // Lấy chi tiết sản phẩm theo ID
  $http
    .get(`http://localhost:8080/chitietsanpham/${id}`)
    .then(function (response) {
      $scope.chiTietSanPhamByIDs = response.data;
      console.log(response.data);

      // Đặt các giá trị ban đầu
      $scope.editData = {
        thuongHieu: $scope.chiTietSanPhamByIDs[0].sanPham.thuongHieu.id,
        danhMuc: $scope.chiTietSanPhamByIDs[0].sanPham.danhMuc.id,
      };
    })
    .catch(function (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      alert("Không tìm thấy chi tiết sản phẩm với ID này.");
    });

  // Lấy danh sách Thương Hiệu
  $http
    .get("http://localhost:8080/thuonghieu")
    .then(function (response) {
      $scope.thuongHieus = response.data;
    })
    .catch(function (error) {
      console.error("Lỗi khi lấy danh sách thương hiệu:", error);
    });

  // Lấy danh sách Danh Mục
  $http
    .get("http://localhost:8080/danhmuc")
    .then(function (response) {
      $scope.danhMucs = response.data;
    })
    .catch(function (error) {
      console.error("Lỗi khi lấy danh sách danh mục:", error);
    });

  // Biến điều khiển chế độ chỉnh sửa
  $scope.isEditing = false;

  // Chuyển chế độ giữa xem và chỉnh sửa
  $scope.toggleEditMode = function () {
    $scope.isEditing = !$scope.isEditing;
  };

  // Cập nhật thông tin khi nhấn "Lưu thay đổi"
  // Cập nhật thông tin khi nhấn "Lưu thay đổi"
  $scope.updateData = function () {
    const updatedData = {
      thuongHieu: { id: $scope.editData.thuongHieu },
      danhMuc: { id: $scope.editData.danhMuc },
    };

    // Gửi yêu cầu PUT để cập nhật thông tin sản phẩm
    $http
      .put(`http://localhost:8080/sanpham/${id}`, updatedData)
      .then(function (response) {
        console.log("Cập nhật sản phẩm thành công:", response.data);
        alert("Cập nhật sản phẩm thành công!");
        $scope.isEditing = false; // Đóng form chỉnh sửa
      })
      .catch(function (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Có lỗi khi cập nhật thông tin.");
      });
  };
});
