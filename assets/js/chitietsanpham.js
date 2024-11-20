var app = angular.module("myApp", []);

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

app.controller("chiTietSanPhamController", function ($scope, $http, $window) {
  $scope.chiTietSanPham = {};
  $scope.availableImages = []; // Khởi tạo mảng images

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

  // Thêm ảnh cho sản phẩm
  $scope.addImagesToProduct = function () {
    const selectedImages = $scope.availableImages.filter(
      (image) => image.selected
    );

    if ($scope.currentProduct && selectedImages.length > 0) {
      if (!$scope.currentProduct.selectedImages) {
        $scope.currentProduct.selectedImages = [];
      }

      $scope.currentProduct.selectedImages = selectedImages;

      toastr.success(
        "Ảnh đã được chọn cho sản phẩm. Nhấn 'Thêm sản phẩm' để lưu ảnh."
      );
      $("#imageModal").modal("hide"); // Đóng modal
    } else {
      toastr.warning("Chưa chọn ảnh nào để thêm.");
    }
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

  // Tạo sản phẩm mới
  $scope.taoSanPham = function () {
    $scope.sanPhamPreview = [];

    $scope.kichCos.forEach((kichCo) => {
      if (kichCo.selected) {
        $scope.mauSacs.forEach((mauSac) => {
          if (mauSac.selected) {
            const sanPhamMoi = {
              sanPham: $scope.chiTietSanPham.sanPham,
              kichCo: kichCo,
              mauSac: mauSac,
              soLuong: $scope.chiTietSanPham.soLuong,
              giaBan: $scope.chiTietSanPham.giaBan,
              deGiay: $scope.chiTietSanPham.deGiay,
              chatLieu: $scope.chiTietSanPham.chatLieu,
              danhMuc: $scope.chiTietSanPham.sanPham.danhMuc,
              thuongHieu: $scope.chiTietSanPham.sanPham.thuongHieu,
              selectedImages: [], // Khởi tạo thuộc tính ảnh
              chonThem: false,
            };

            if ($scope.chiTietSanPham.selectedImages) {
              sanPhamMoi.selectedImages = $scope.chiTietSanPham.selectedImages;
            }

            $scope.sanPhamPreview.push(sanPhamMoi);
          }
        });
      }
    });

    // In ra kết quả danh sách sản phẩm đã tạo để kiểm tra
    console.log($scope.sanPhamPreview);
  };

  $scope.isProductCreated = true; // hoặc điều kiện bạn muốn set giá trị này

  $scope.themSanPham = function () {
    const selectedProducts = $scope.sanPhamPreview.filter(function (sp) {
      return sp.chonThem === true;
    });

    if (selectedProducts.length > 0) {
      const promises = selectedProducts.map(function (product) {
        // Log dữ liệu sản phẩm trước khi gửi
        console.log("Dữ liệu sản phẩm gửi đi:", product);

        return $http
          .post("http://localhost:8080/chitietsanpham", product)
          .then(function (response) {
            toastr.success("Sản phẩm đã được thêm vào cơ sở dữ liệu.");
            // Tiến hành thêm ảnh nếu có
            if (product.selectedImages && product.selectedImages.length > 0) {
              const chiTietAnhGiayPromises = product.selectedImages.map(
                function (image) {
                  const chiTietAnhGiay = {
                    trangThai: 1,
                    chiTietSanPham: { id: response.data.id }, // ID sản phẩm đã được tạo
                    anhGiay: { id: image.id },
                  };

                  return $http
                    .post(
                      "http://localhost:8080/chitietanhgiay",
                      chiTietAnhGiay
                    )
                    .then(function () {
                      toastr.success("Ảnh đã được thêm cho sản phẩm!");
                    })
                    .catch(function (error) {
                      toastr.error(
                        "Lỗi khi thêm ảnh cho sản phẩm: " + error.message
                      );
                    });
                }
              );
              return Promise.all(chiTietAnhGiayPromises);
            }
          })
          .catch(function (error) {
            console.error("Lỗi khi thêm sản phẩm:", error);
            toastr.error("Có lỗi khi thêm sản phẩm.");
          });
      });

      Promise.all(promises)
        .then(function () {
          $scope.isProductCreated = true;
        })
        .catch(function (error) {
          toastr.error(
            "Có lỗi xảy ra khi thêm sản phẩm hoặc ảnh: " + error.message
          );
        });
    } else {
      toastr.warning("Chưa chọn sản phẩm nào để thêm.");
    }
  };

  // Mở modal chọn ảnh cho sản phẩm
  $scope.openImageModal = function (product) {
    $scope.currentProduct = product; // Lưu sản phẩm hiện tại

    if (Array.isArray($scope.availableImages)) {
      $scope.availableImages.forEach((image) => {
        image.selected = false; // Đặt lại trạng thái chọn
      });
    }

    $http
      .get("http://localhost:8080/anhgiay")
      .then(function (response) {
        $scope.availableImages = response.data; // Cập nhật danh sách ảnh có sẵn
        $("#imageModal").modal("show"); // Mở modal
      })
      .catch(function (error) {
        toastr.error("Lỗi khi tải danh sách ảnh.", "Thông báo");
      });
  };

  // Lấy đường dẫn ảnh
  $scope.getImageUrl = function (image) {
    return (
      "http://localhost:8080/anhgiay/images/" +
      image.tenURL.replace(/^\/images\//, "")
    );
  };

  // Xóa sản phẩm
  $scope.xoaSanPham = function (sp) {
    const index = $scope.sanPhamPreview.indexOf(sp);
    if (index > -1) {
      $scope.sanPhamPreview.splice(index, 1);
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
