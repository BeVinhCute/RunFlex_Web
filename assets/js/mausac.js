var app = angular.module("myApp", []);

app.controller("MainController", function ($scope, $http) {
  $scope.isEditing = false; // Biến theo dõi có hàng nào đang được chỉnh sửa

  // Load initial data
  $scope.loadData = function () {
    $http.get("http://localhost:8080/mausac").then(
      function (response) {
        $scope.mauSacs = response.data;
        // Thêm thuộc tính isEditing và lưu giá trị ban đầu
        $scope.mauSacs.forEach(function (mauSac) {
          mauSac.isEditing = false;
          mauSac.originalTenMauSac = mauSac.tenMauSac; // Lưu giá trị ban đầu
        });
      },
      function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    );
  };

  // POST: Thêm mới màu sắc
  $scope.submitData = function () {
    $http.post("http://localhost:8080/mausac", $scope.mauSac).then(
      function (response) {
        $scope.mauSacs.unshift(response.data); // Thêm mới màu sắc vào đầu danh sách
        $scope.resetForm();
        toastr.success("Thêm mới thành công!", "Thông báo");
        $("#addModal").modal("hide");
      },
      function (error) {
        toastr.error("Có lỗi xảy ra!", "Thông báo");
      }
    );
  };

  // Toggle chế độ chỉnh sửa
  $scope.toggleEdit = function (mauSac) {
    if (mauSac.isEditing) {
      // Lưu lại khi đang chỉnh sửa
      $scope.updateData(mauSac);
      $scope.isEditing = false;
    } else {
      $scope.isEditing = true;
    }
    mauSac.isEditing = !mauSac.isEditing;
  };

  // Hủy sửa
  $scope.cancelEdit = function (mauSac) {
    mauSac.tenMauSac = mauSac.originalTenMauSac; // Khôi phục giá trị ban đầu
    mauSac.isEditing = false;
    $scope.isEditing = false;
  };

  // PUT: Cập nhật màu sắc
  $scope.updateData = function (mauSac) {
    if (mauSac.id) {
      $http.put(`http://localhost:8080/mausac/${mauSac.id}`, mauSac).then(
        function (response) {
          toastr.success("Cập nhật thành công!", "Thông báo");
          mauSac.originalTenMauSac = mauSac.tenMauSac; // Cập nhật giá trị gốc sau khi lưu
          mauSac.isEditing = false;
          $scope.isEditing = false;
          $scope.loadData();
        },
        function (error) {
          toastr.error("Có lỗi xảy ra!", "Thông báo");
        }
      );
    } else {
      toastr.error("ID không hợp lệ!", "Thông báo");
    }
  };

  // DELETE: Xóa màu sắc
  $scope.deleteData = function (id) {
    $http.delete(`http://localhost:8080/mausac/${id}`).then(
      function (response) {
        $scope.loadData();
        toastr.success("Xóa thành công!", "Thông báo");
      },
      function (error) {
        console.error("Lỗi khi xóa:", error);
      }
    );
  };

  // Reset form
  $scope.resetForm = function () {
    $scope.mauSac = {
      tenMauSac: "",
      trangThai: 1,
    };
  };

  // Load data initially
  $scope.loadData();
});
