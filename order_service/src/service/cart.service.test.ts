import * as Repository from "../repository/cart.repository";
import { CartRepositoryType } from "../types/repository.type";
import { CreateCart } from "./cart.service";

describe("cartService", () => {
  let repo: CartRepositoryType;

  beforeEach(() => {
    repo = Repository.CartRepository;
  });

  afterEach(() => {
    repo = {} as CartRepositoryType;
  });

  it("should return correct data while creating cart", async () => {
    const mockCart = {
      title: "smart phone",
      price: 1200,
    };

    jest.spyOn(Repository.CartRepository, "create").mockImplementationOnce(() =>
      Promise.resolve({
        message: "fake response from cart repo",
        input: mockCart,
      })
    );

    const response = await CreateCart(mockCart, repo);

    expect(response).toEqual({
      message: "fake response from cart repo",
      input: mockCart,
    });
  });
});
