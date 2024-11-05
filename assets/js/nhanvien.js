var app = angular.module("myApp", []);

app.controller("NhanVienController", function ($scope, $http) {
  $scope.nhanViens = [];
  $scope.newNhanVien = {};
  $scope.editMode = false;

  // Load dữ liệu ban đầu
  $scope.loadData = function () {
    $http.get("http://localhost:8080/nhanvien/all").then(
      function (response) {
        $scope.nhanViens = response.data;
      },
      function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    );
  };

  // Thêm mới nhân viên
  $scope.submitData = function () {
    if ($scope.editMode) {
      // Cập nhật nhân viên
      $http
        .put(
          `http://localhost:8080/nhanvien/${$scope.newNhanVien.id}`,
          $scope.newNhanVien
        )
        .then(
          function (response) {
            const index = $scope.nhanViens.findIndex(
              (nv) => nv.id === $scope.newNhanVien.id
            );
            $scope.nhanViens[index] = response.data;
            resetForm();
          },
          function (error) {
            console.error("Có lỗi xảy ra:", error);
          }
        );
    } else {
      // Thêm mới nhân viên
      $http.post("http://localhost:8080/nhanvien", $scope.newNhanVien).then(
        function (response) {
          $scope.nhanViens.push(response.data);
          resetForm();
        },
        function (error) {
          console.error("Có lỗi xảy ra:", error);
        }
      );
    }
  };

  // Chỉnh sửa nhân viên
  $scope.editNhanVien = function (nhanVien) {
    $scope.newNhanVien = angular.copy(nhanVien);
    $scope.editMode = true;
    $("#addModal").modal("show");
  };

  // Xóa nhân viên
  $scope.deleteNhanVien = function (id) {
    if (confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      $http.delete(`http://localhost:8080/nhanvien/${id}`).then(
        function (response) {
          $scope.loadData(); // Load lại dữ liệu
        },
        function (error) {
          console.error("Lỗi khi xóa:", error);
        }
      );
    }
  };

  // Reset form
  function resetForm() {
    $scope.newNhanVien = {};
    $scope.editMode = false;
    $("#addModal").modal("hide"); // Đóng modal
    $scope.loadData(); // Tải lại dữ liệu
  }

  // Khởi động dữ liệu
  $scope.loadData();
});
