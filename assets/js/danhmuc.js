var app = angular.module("myApp", []);

app.controller("MainController", function ($scope, $http) {
  $scope.isEditing = false; // Biến theo dõi có hàng nào đang được chỉnh sửa

  // Load dữ liệu ban đầu
  $scope.loadData = function () {
    $http.get("http://localhost:8080/danhmuc").then(
      function (response) {
        $scope.danhMucs = response.data;
        // Thêm thuộc tính isEditing và lưu giá trị ban đầu
        $scope.danhMucs.forEach(function (danhMuc) {
          danhMuc.isEditing = false;
          danhMuc.originalTenDanhMuc = danhMuc.tenDanhMuc; // Lưu giá trị ban đầu
        });
      },
      function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    );
  };

  // POST: Thêm mới danh mục
  $scope.submitData = function () {
    $http.post("http://localhost:8080/danhmuc", $scope.danhMuc).then(
      function (response) {
        $scope.danhMucs.unshift(response.data); // Đưa danh mục mới lên đầu danh sách
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
    $scope.danhMuc = {};
  };

  // Toggle chế độ chỉnh sửa
  $scope.toggleEdit = function (danhMuc) {
    if (danhMuc.isEditing) {
      // Lưu lại khi đang chỉnh sửa
      $scope.updateData(danhMuc);
      $scope.isEditing = false;
    } else {
      $scope.isEditing = true;
    }
    danhMuc.isEditing = !danhMuc.isEditing;
  };

  // Hủy chỉnh sửa
  $scope.cancelEdit = function (danhMuc) {
    danhMuc.tenDanhMuc = danhMuc.originalTenDanhMuc; // Khôi phục giá trị ban đầu
    danhMuc.isEditing = false;
    $scope.isEditing = false;
  };

  // PUT: Cập nhật danh mục
  $scope.updateData = function (danhMuc) {
    if (danhMuc.id) {
      $http.put(`http://localhost:8080/danhmuc/${danhMuc.id}`, danhMuc).then(
        function (response) {
          toastr.success("Cập nhật thành công!", "Thông báo");
          danhMuc.originalTenDanhMuc = danhMuc.tenDanhMuc; // Cập nhật giá trị gốc sau khi lưu
          danhMuc.isEditing = false;
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

  // DELETE: Xóa danh mục
  $scope.deleteData = function (id) {
    $http.delete(`http://localhost:8080/danhmuc/${id}`).then(
      function (response) {
        $scope.loadData();
        toastr.success("Xóa thành công!", "Thông báo");
      },
      function (error) {
        console.error("Lỗi khi xóa:", error);
      }
    );
  };

  // Load dữ liệu ban đầu khi trang được mở
  $scope.loadData();
});
