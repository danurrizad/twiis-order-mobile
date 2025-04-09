import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faBackspace,
  faBackward,
  faBell,
  faCartShopping,
  faSearch,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart, faSadCry } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { router, Stack } from "expo-router";
import useShopService from "@/services/ShopDataService";
import config from "../utils/Config";
import { useData } from "../utils/context/DataContext";

interface ProductsInterface {
  id: number;
  description: string;
  img: string;
  minOrder: number;
  maxOrder: number;
  uom: string;
}

export default function Office() {
  const { getProductsByCategory } = useShopService();
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState<any>([]);
  const { warehouse, warehouseName, loading, setLoading } = useData();

  const fetchProductsByCategory = async () => {
    try {
      setLoading(true);
      const response = await getProductsByCategory(warehouse, 3, page, 20);
      if (response?.data) {
        setProducts([...products, ...response.data]); // Append new products
        setPage((prevPage) => prevPage + 1); // Increment page number
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsByCategory();
  }, [warehouse]);

  return (
    <>
      <View
        style={{
          paddingHorizontal: 10,
          backgroundColor: "white",
          paddingBottom: 150, 
          height: "100%"
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Office Supply</Text>
        <Text style={{ fontSize: 14, paddingBottom: 10, marginBottom: 10 }}>
          Administrative tasks and workflows support
        </Text>
        <FlatList
          style={{ backgroundColor: "white", paddingHorizontal: 10 }}
          data={products}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: "/detail-product/product",
                  params: {
                    id: item.id,
                    description: item.Material.description,
                    materialNo: item.Material.materialNo,
                    img: item.Material.img,
                    warehouseId: item.Address_Rack.Storage.Plant.warehouseId,
                    categoryId: item.Material.categoryId,
                    minOrder: item.Material.minOrder,
                    uom: item.Material.uom,
                  },
                });
              }}
              style={{
                width: "48%",
                position: "relative",
                borderWidth: 0.5,
                borderRadius: 10,
                borderColor: "gray",
                padding: 10,
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    borderWidth: 0,
                    borderColor: "gray",
                    height: 150,
                    marginBottom: 5,
                  }}
                >
                  <Image
                    source={{
                      uri: `${config.BACKEND_URL}${item.Material.img}.jpg`,
                    }}
                    alt={`${item.Material.id}-${item.Material.description}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "center",
                    }}
                  />
                </View>
                <View style={{ position: "absolute", top: 0, right: 0 }}>
                  <TouchableOpacity>
                    <FontAwesomeIcon icon={faHeart} size={25} />
                  </TouchableOpacity>
                </View>
                <Text
                  style={{ fontSize: 12, fontWeight: "bold" }}
                  numberOfLines={2}
                >
                  {item.Material.description}
                </Text>
                <Text style={{ fontSize: 12 }}>{item.Material.materialNo}</Text>
              </View>
            </TouchableOpacity>
          )}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingBottom: 15,
          }}
          ListFooterComponent={() =>
            loading && <ActivityIndicator size="large" />
          }
          onEndReached={fetchProductsByCategory} // 🔥 Trigger API call when reaching end
          onEndReachedThreshold={0.5}
        />
      </View>
    </>
  );
}
