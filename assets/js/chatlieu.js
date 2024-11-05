var app = angular.module("myApp", []);

app.controller("MainController", function ($scope, $http) {
  $scope.isEditing = false; // Biến theo dõi có hàng nào đang được chỉnh sửa

  // Load dữ liệu ban đầu
  $scope.loadData = function () {
    $http.get("http://localhost:8080/chatlieu").then(
      function (response) {
        $scope.chatLieus = response.data;
        // Thêm thuộc tính isEditing và lưu giá trị ban đầu
        $scope.chatLieus.forEach(function (chatLieu) {
          chatLieu.isEditing = false;
          chatLieu.originalTenChatLieu = chatLieu.tenChatLieu; // Lưu giá trị ban đầu
        });
      },
      function (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    );
  };

  // POST: Thêm mới chất liệu
  $scope.submitData = function () {
    $http.post("http://localhost:8080/chatlieu", $scope.chatLieu).then(
      function (response) {
        $scope.chatLieus.unshift(response.data); // Đưa chất liệu mới lên đầu danh sách
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
    $scope.chatLieu = {};
  };

  // Toggle chế độ chỉnh sửa
  $scope.toggleEdit = function (chatLieu) {
    if (chatLieu.isEditing) {
      // Lưu lại khi đang chỉnh sửa
      $scope.updateData(chatLieu);
      $scope.isEditing = false;
    } else {
      $scope.isEditing = true;
    }
    chatLieu.isEditing = !chatLieu.isEditing;
  };

  // Hủy chỉnh sửa
  $scope.cancelEdit = function (chatLieu) {
    chatLieu.tenChatLieu = chatLieu.originalTenChatLieu; // Khôi phục giá trị ban đầu
    chatLieu.isEditing = false;
    $scope.isEditing = false;
  };

  // PUT: Cập nhật chất liệu
  $scope.updateData = function (chatLieu) {
    if (chatLieu.id) {
      $http.put(`http://localhost:8080/chatlieu/${chatLieu.id}`, chatLieu).then(
        function (response) {
          toastr.success("Cập nhật thành công!", "Thông báo");
          chatLieu.originalTenChatLieu = chatLieu.tenChatLieu; // Cập nhật giá trị gốc sau khi lưu
          chatLieu.isEditing = false;
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

  // DELETE: Xóa chất liệu
  $scope.deleteData = function (id) {
    $http.delete(`http://localhost:8080/chatlieu/${id}`).then(
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
