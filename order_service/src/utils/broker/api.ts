import axios from "axios";
import { APIError, AuthorizeError, NotFoundError } from "../error";
import { logger } from "../logger";
import { Product } from "../../dto/product.dto";
import { User } from "../../dto/User.Model";

const CATALOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:9001"; // env variable

const AUTH_SERVICE_BASE_URL =
  process.env.AUTH_SERVICE_BASE_URL || "http://localhost:9000";

export const GetProductDetails = async (productId: number) => {
  try {
    const response = await axios.get(
      `${CATALOG_BASE_URL}/products/${productId}`
    );
    return response.data as Product;
  } catch (err) {
    logger.error(err);
    throw new NotFoundError("product not found");
  }
};

export const GetStockDetails = async (productId: number[]) => {
  try {
    const response = await axios.post(`${CATALOG_BASE_URL}/products/stock`, { productId });
    return response.data as Product[];
  } catch (err) {
    logger.error(err);
    throw new NotFoundError("error fetching stock details");
  }
};

export const ValidateUser = async (token: string) => {
  try {
    // axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(`${AUTH_SERVICE_BASE_URL}/auth/validate`, {
      headers: { Authorization: token },
    });

    if (response.status !== 200) {
      throw new AuthorizeError("user not authorized");
    }

    return response.data as User;
  } catch (err) {
    logger.error(err);
    throw new AuthorizeError("user not authorized");
  }
};
