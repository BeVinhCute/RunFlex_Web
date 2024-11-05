var app = angular.module("myApp", []);

app.controller("MainController", function ($scope, $http) {
  $scope.isEditing = false; // Biến theo dõi có hàng nào đang được chỉnh sửa

  // Load dữ liệu ban đầu
  $scope.loadData = function () {
    $http.get("http://localhost:8080/thuonghieu").then(
      function (response) {
        $scope.thuongHieus = response.data;
        $scope.thuongHieus.forEach(function (thuongHieu) {
          thuongHieu.isEditing = false;
          thuongHieu.originalTenThuongHieu = thuongHieu.tenThuongHieu;
        });
        // Sau khi thêm mới, hãy đảm bảo danh sách hiển thị đúng thứ tự
        $scope.sortByTenThuongHieu();
      },
      function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    );
  };

  // POST: Thêm mới thương hiệu
  $scope.submitData = function () {
    const newThuongHieu = angular.copy($scope.thuongHieu); // Tạo một bản sao mới của thương hiệu
    $http.post("http://localhost:8080/thuonghieu", newThuongHieu).then(
      function (response) {
        $scope.thuongHieus.unshift(response.data); // Thêm vào đầu danh sách
        $scope.resetForm();
        toastr.success("Thêm mới thành công!", "Thông báo");
        $("#addModal").modal("hide");
      },
      function (error) {
        toastr.error("Có lỗi xảy ra!", "Thông báo");
      }
    );
  };

  // Reset form sau khi thêm mới
  $scope.resetForm = function () {
    $scope.thuongHieu = {};
  };

  // Toggle chế độ chỉnh sửa
  $scope.toggleEdit = function (thuongHieu) {
    if (thuongHieu.isEditing) {
      // Lưu lại khi đang chỉnh sửa
      $scope.updateData(thuongHieu);
      $scope.isEditing = false;
    } else {
      $scope.isEditing = true;
    }
    thuongHieu.isEditing = !thuongHieu.isEditing;
  };

  // Hủy chỉnh sửa
  $scope.cancelEdit = function (thuongHieu) {
    thuongHieu.tenThuongHieu = thuongHieu.originalTenThuongHieu; // Khôi phục giá trị ban đầu
    thuongHieu.isEditing = false;
    $scope.isEditing = false;
    $scope.sortByTenThuongHieu(); // Sắp xếp lại sau khi hủy chỉnh sửa
  };

  // PUT: Cập nhật thương hiệu
  $scope.updateData = function (thuongHieu) {
    if (thuongHieu.id) {
      $http
        .put(`http://localhost:8080/thuonghieu/${thuongHieu.id}`, thuongHieu)
        .then(
          function (response) {
            toastr.success("Cập nhật thành công!", "Thông báo");
            thuongHieu.originalTenThuongHieu = thuongHieu.tenThuongHieu; // Cập nhật giá trị gốc sau khi lưu
            thuongHieu.isEditing = false;
            $scope.isEditing = false;
            $scope.loadData(); // Load lại dữ liệu sau khi lưu
          },
          function (error) {
            toastr.error("Có lỗi xảy ra!", "Thông báo");
          }
        );
    } else {
      toastr.error("ID không hợp lệ!", "Thông báo");
    }
  };

  // DELETE: Xóa thương hiệu
  $scope.deleteData = function (id) {
    $http.delete(`http://localhost:8080/thuonghieu/${id}`).then(
      function (response) {
        $scope.loadData();
        toastr.success("Xóa thành công!", "Thông báo");
      },
      function (error) {
        console.error("Lỗi khi xóa:", error);
      }
    );
  };

  // Sắp xếp danh sách theo tên thương hiệu
  $scope.sortByTenThuongHieu = function () {
    if (!$scope.isEditing) {
      $scope.thuongHieus.sort(function (a, b) {
        return a.tenThuongHieu.localeCompare(b.tenThuongHieu);
      });
    }
  };

  // Load dữ liệu ban đầu khi trang được mở
  $scope.loadData();
});
