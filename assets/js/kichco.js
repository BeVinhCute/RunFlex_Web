var app = angular.module("myApp", []);

app.controller("MainController", function ($scope, $http) {
  $scope.isEditing = false; // Biến theo dõi có hàng nào đang được chỉnh sửa

  // Load initial data
  $scope.loadData = function () {
    $http.get("http://localhost:8080/kichco").then(
      function (response) {
        $scope.kichCos = response.data;
        // Thêm thuộc tính isEditing và lưu giá trị ban đầu
        $scope.kichCos.forEach(function (kichCo) {
          kichCo.isEditing = false;
          kichCo.originalSoKichCo = kichCo.soKichCo; // Lưu giá trị ban đầu
        });
      },
      function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    );
  };

  // POST: Thêm mới kích cỡ
  $scope.submitData = function () {
    // Kiểm tra nếu form đang trong quá trình submit để tránh submit nhiều lần
    if (!$scope.kichCo) {
      toastr.error("Dữ liệu không hợp lệ!", "Thông báo");
      return;
    }

    $http.post("http://localhost:8080/kichco", $scope.kichCo).then(
      function (response) {
        // Thêm dữ liệu mới vào danh sách
        $scope.kichCos.unshift(response.data);

        // Reset form
        $scope.resetForm();

        // Ẩn modal sau khi thêm thành công
        $("#addModal").modal("hide");

        // Hiển thị toastr sau khi modal ẩn thành công
        toastr.success("Thêm mới thành công!", "Thông báo");

        // Sắp xếp danh sách kích cỡ
        $scope.sortBySoKichCo();
      },
      function (error) {
        toastr.error("Có lỗi xảy ra!", "Thông báo");
      }
    );
  };

  // Hàm reset form
  $scope.resetForm = function () {
    // Reset đối tượng kích cỡ và form
    $scope.kichCo = {};
    // Nếu bạn có một form với id "addSizeForm", hãy reset nó:
    document.getElementById("addSizeForm").reset();
  };

  // Toggle chế độ chỉnh sửa
  $scope.toggleEdit = function (kichCo) {
    if (kichCo.isEditing) {
      // Lưu lại khi đang chỉnh sửa
      $scope.updateData(kichCo);
      $scope.isEditing = false;
    } else {
      $scope.isEditing = true;
    }
    kichCo.isEditing = !kichCo.isEditing;
  };

  // Hủy sửa
  $scope.cancelEdit = function (kichCo) {
    kichCo.soKichCo = kichCo.originalSoKichCo; // Khôi phục giá trị ban đầu
    kichCo.isEditing = false;
    $scope.isEditing = false;
    $scope.sortBySoKichCo(); // Gọi lại sắp xếp khi hủy chỉnh sửa
  };

  // PUT: Cập nhật kích cỡ
  $scope.updateData = function (kichCo) {
    if (kichCo.id) {
      $http.put(`http://localhost:8080/kichco/${kichCo.id}`, kichCo).then(
        function (response) {
          toastr.success("Cập nhật thành công!", "Thông báo");
          kichCo.originalSoKichCo = kichCo.soKichCo; // Cập nhật giá trị gốc sau khi lưu
          kichCo.isEditing = false;
          $scope.isEditing = false;
          $scope.loadData(); // Gọi lại sắp xếp sau khi lưu
        },
        function (error) {
          toastr.error("Có lỗi xảy ra!", "Thông báo");
        }
      );
    } else {
      toastr.error("ID không hợp lệ!", "Thông báo");
    }
  };

  // DELETE: Xóa kích cỡ
  $scope.deleteData = function (id) {
    $http.delete(`http://localhost:8080/kichco/${id}`).then(
      function (response) {
        $scope.loadData();
        toastr.success("Xóa thành công!", "Thông báo");
      },
      function (error) {
        console.error("Lỗi khi xóa:", error);
      }
    );
  };

  // Sắp xếp danh sách
  $scope.sortBySoKichCo = function () {
    // Không sắp xếp nếu có hàng đang chỉnh sửa
    if (!$scope.isEditing) {
      $scope.kichCos.sort(function (a, b) {
        return a.soKichCo - b.soKichCo;
      });
    }
  };

  // Load data initially
  $scope.loadData();
  // Cấu hình toastr trong AngularJS
});
