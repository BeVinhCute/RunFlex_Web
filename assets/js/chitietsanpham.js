var app = angular.module("myApp", []);

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

app.controller("chiTietSanPhamController", function ($scope, $http, $window) {
  $scope.isProductCreated = false;
  $scope.availableImages = [];
  $scope.sanPhamPreviewBackup = [];
  $scope.chiTietSanPham = {};
  $scope.currentMauSac = {}; // Khởi tạo đối tượng rỗng nếu mauSac không có giá trị
  $scope.currentMauSac.selectedImages = []; // Khởi tạo mảng nếu chưa có

  // Tải dữ liệu ban đầu
  $scope.loadData = function () {
    const requests = [
      $http.get("http://localhost:8080/thuonghieu"),
      $http.get("http://localhost:8080/danhmuc"),
      $http.get("http://localhost:8080/sanpham"),
      $http.get("http://localhost:8080/kichco"),
      $http.get("http://localhost:8080/mausac"),
      $http.get("http://localhost:8080/degiay"),
      $http.get("http://localhost:8080/chatlieu"),
    ];

    Promise.all(requests)
      .then(function (responses) {
        $scope.thuongHieus = responses[0].data;
        $scope.danhMucs = responses[1].data;
        $scope.sanPhams = responses[2].data;
        $scope.kichCos = responses[3].data;
        $scope.mauSacs = responses[4].data;
        $scope.deGiays = responses[5].data;
        $scope.chatLieus = responses[6].data;
      })
      .catch(function (error) {
        toastr.error("Lỗi khi tải dữ liệu", "Thông báo");
      });
  };

  // Lấy chi tiết sản phẩm theo ID
  $http
    .get(`http://localhost:8080/chitietsanpham/${id}`)
    .then(function (response) {
      $scope.chiTietSanPhamByIDs = response.data;
    })
    .catch(function (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    });

  $scope.taoSanPham = function () {
    $scope.kichCos.forEach(function (kichCo) {
      if (kichCo.selected) {
        $scope.mauSacs.forEach(function (mauSac) {
          if (mauSac.selected) {
            $scope.sanPhamPreviewBackup.push({
              sanPham: $scope.chiTietSanPham.sanPham,
              kichCo: kichCo,
              mauSac: mauSac,
              soLuong: $scope.chiTietSanPham.soLuong || 0, // Gán giá trị mặc định nếu chưa có
              giaBan: $scope.chiTietSanPham.giaBan || 0, // Gán giá trị mặc định nếu chưa có
              deGiay: $scope.chiTietSanPham.deGiay,
              chatLieu: $scope.chiTietSanPham.chatLieu,
              danhMuc: $scope.chiTietSanPham.sanPham.danhMuc,
              thuongHieu: $scope.chiTietSanPham.sanPham.thuongHieu,
              chonThem: false,
              selectedImages: [], // Khởi tạo mảng ảnh rỗng
            });
          }
        });
      }
    });
    $scope.isProductCreated = true;
  };

  // Kiểm tra nếu ảnh đã được chọn
  $scope.isImageSelected = function (image) {
    return $scope.currentMauSac.selectedImages.some(function (img) {
      return img.id === image.id;
    });
  };

  $scope.loadColorImages = function (mauSac) {
    // Tải ảnh cho màu sắc hiện tại
    $http;
    $http
      .get(`http://localhost:8080/anhgiay?mauSacId=${mauSac.id}`)
      .then(function (response) {
        $scope.availableImages = response.data;
        $scope.currentMauSac = mauSac;
        $("#imageModal").modal("show");
      })
      .catch(function (error) {
        if (error.status === 404) {
          toastr.error("Không tìm thấy ảnh cho màu sắc này!", "Thông báo");
        } else {
          toastr.error(
            "Lỗi khi tải ảnh từ máy chủ, vui lòng thử lại sau.",
            "Thông báo"
          );
        }
      });
  };

  // Thêm ảnh vào màu sắc
  $scope.addImagesToColor = function () {
    const selectedImages = $scope.availableImages.filter(function (image) {
      return image.selected;
    });

    if (selectedImages.length === 0) {
      toastr.error("Không có ảnh nào được chọn!", "Thông báo");
      return;
    }

    // Khởi tạo danh sách nếu chưa có
    $scope.currentMauSac.selectedImages =
      $scope.currentMauSac.selectedImages || [];

    // Thêm chỉ những ảnh mới, chưa có vào danh sách
    selectedImages.forEach(function (image) {
      if (
        !$scope.currentMauSac.selectedImages.some(function (img) {
          return img.id === image.id;
        })
      ) {
        $scope.currentMauSac.selectedImages.push(image);
      }
    });

    // Cập nhật lại dữ liệu cho sản phẩm trong sanPhamPreviewBackup
    $scope.sanPhamPreviewBackup.forEach(function (sp) {
      if (sp.mauSac.id === $scope.currentMauSac.id) {
        sp.selectedImages = angular.copy($scope.currentMauSac.selectedImages);
      }
    });

    $("#imageModal").modal("hide");
    toastr.success("Thêm ảnh thành công cho màu sắc!", "Thông báo");
  };

  // Lấy URL của ảnh
  $scope.getImageUrl = function (image) {
    return (
      "http://localhost:8080/anhgiay/images/" +
      encodeURIComponent(image.tenURL.replace(/^\/images\//, ""))
    );
  };

  // Xóa sản phẩm
  $scope.xoaSanPham = function (sp) {
    const index = $scope.sanPhamPreviewBackup.indexOf(sp);
    if (index > -1) {
      $scope.sanPhamPreviewBackup.splice(index, 1);
      toastr.success("Sản phẩm đã được xóa thành công!");
    } else {
      toastr.error("Không tìm thấy sản phẩm cần xóa.");
    }
  };

  // Gửi dữ liệu sản phẩm
  $scope.submitData = function () {
    $http
      .post("http://localhost:8080/chitietsanpham", $scope.chiTietSanPham)
      .then(function (response) {
        toastr.success("Thêm mới thành công!", "Thông báo");
        const sanPhamId = response.data.sanPham.id;
        if (sanPhamId) {
          $window.location.href = `/html/chitietsanpham.html?id=${sanPhamId}`;
        } else {
          toastr.error("Không có ID sản phẩm trong phản hồi.", "Thông báo");
        }
      })
      .catch(function (error) {
        toastr.error("Có lỗi khi tạo sản phẩm!", "Thông báo");
      });
  };

  // Cập nhật thông tin sản phẩm
  $scope.updateData = function (chiTietSanPham) {
    if (chiTietSanPham.isEditing) {
      $http
        .put(
          `http://localhost:8080/chitietsanpham/${chiTietSanPham.id}`,
          chiTietSanPham
        )
        .then(function (response) {
          toastr.success("Cập nhật thành công!", "Thông báo");
          chiTietSanPham.isEditing = false;
          $scope.loadData(); // Tải lại dữ liệu
        })
        .catch(function (error) {
          toastr.error("Có lỗi xảy ra khi cập nhật!", "Thông báo");
        });
    } else {
      chiTietSanPham.isEditing = true;
    }
  };

  // Xóa thông tin sản phẩm
  $scope.deleteData = function (id) {
    if (confirm("Bạn có chắc chắn muốn xóa chi tiết sản phẩm này?")) {
      $http
        .delete(`http://localhost:8080/chitietsanpham/${id}`)
        .then(function (response) {
          $scope.loadData(); // Tải lại dữ liệu sau khi xóa
          toastr.success("Xóa thành công!", "Thông báo");
        })
        .catch(function (error) {
          toastr.error("Xóa thất bại. Vui lòng thử lại!", "Thông báo");
        });
    }
  };

  // Khởi động tải dữ liệu
  $scope.loadData();
});
