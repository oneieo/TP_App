// import { create } from "zustand";
// import { devtools } from "zustand/middleware";

// export interface Category {
//   id: string;
//   name: string;
//   icon: string;
//   color: string;
// }

// interface CategoryState {
//   selectedCategoryId: string;
//   selectedCategoryName: string;
//   categories: Category[];

//   setSelectedCategory: (categoryName: string) => void;
//   clearSelectedCategory: () => void;
//   toggleCategory: (categoryName: string) => void;

//   getSelectedCategory: () => Category | null;
//   isCategorySelected: (categoryName: string) => boolean;
// }

// // 총학생회, 단과대학, 음식점, 카페, 술집, 기타 변경
// const defaultCategories: Category[] = [
//   {
//     id: "1",
//     name: "단과대학",
//     icon: "ri-service-fill",
//     color: "bg-red-100 text-red-600",
//   },
//   {
//     id: "2",
//     name: "총학생회",
//     icon: "ri-star-fill",
//     color: "bg-amber-100 text-amber-600",
//   },
//   {
//     id: "3",
//     name: "음식점",
//     icon: "ri-restaurant-fill",
//     color: "bg-pink-100 text-pink-600",
//   },
//   {
//     id: "4",
//     name: "카페",
//     icon: "ri-cup-fill",
//     color: "bg-blue-100 text-blue-600",
//   },
//   {
//     id: "5",
//     name: "주점",
//     icon: "ri-beer-fill",
//     color: "bg-green-100 text-green-600",
//   },
//   {
//     id: "6",
//     name: "기타",
//     icon: "ri-shopping-bag-fill",
//     color: "bg-purple-100 text-purple-600",
//   },
// ];

// // const defaultCategories: Category[] = [
// //   {
// //     id: "1",
// //     name: "즐겨찾기",
// //     icon: "ri-star-fill",
// //     color: "bg-red-100 text-red-600",
// //   },
// //   {
// //     id: "2",
// //     name: "제휴",
// //     icon: "ri-service-fill",
// //     color: "bg-amber-100 text-amber-600",
// //   },
// //   {
// //     id: "3",
// //     name: "음식점",
// //     icon: "ri-restaurant-fill",
// //     color: "bg-pink-100 text-pink-600",
// //   },
// //   {
// //     id: "4",
// //     name: "카페",
// //     icon: "ri-cup-fill",
// //     color: "bg-blue-100 text-blue-600",
// //   },
// //   {
// //     id: "5",
// //     name: "헤어샵",
// //     icon: "ri-scissors-cut-fill",
// //     color: "bg-green-100 text-green-600",
// //   },
// //   {
// //     id: "6",
// //     name: "마트",
// //     icon: "ri-shopping-bag-fill",
// //     color: "bg-purple-100 text-purple-600",
// //   },
// //   //   {
// //   //     id: "5",
// //   //     name: "편의점",
// //   //     icon: "ri-light-fill",
// //   //     color: "bg-green-100 text-green-600",
// //   //   },
// // ];

// export const useCategoryStore = create<CategoryState>()(
//   devtools(
//     (set, get) => ({
//       selectedCategoryId: "",
//       selectedCategoryName: "",
//       categories: defaultCategories,

//       // 카테고리 선택
//       setSelectedCategory: (categoryName: string) =>
//         set(
//           { selectedCategoryName: categoryName },
//           false,
//           "setSelectedCategory"
//         ),

//       // 카테고리 선택 해제
//       clearSelectedCategory: () =>
//         set({ selectedCategoryName: "" }, false, "clearSelectedCategory"),

//       // 카테고리 토글 (선택된 것을 다시 클릭하면 해제)
//       toggleCategory: (categoryName: string) => {
//         const { selectedCategoryName } = get();
//         set(
//           {
//             selectedCategoryName:
//               selectedCategoryName === categoryName ? "" : categoryName,
//           },
//           false,
//           "toggleCategory"
//         );
//       },

//       // 선택된 카테고리 객체 반환
//       getSelectedCategory: () => {
//         const { selectedCategoryName, categories } = get();
//         return (
//           categories.find((cat) => cat.name === selectedCategoryName) || null
//         );
//       },

//       // 카테고리 선택 여부 확인
//       isCategorySelected: (categoryName: string) => {
//         const { selectedCategoryName } = get();
//         return selectedCategoryName === categoryName;
//       },
//     }),
//     {
//       name: "category-store",
//     }
//   )
// );

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CategoryState {
  selectedCategoryId: string;
  selectedCategoryName: string;
  categories: Category[];
  topCategory: string;

  setSelectedCategory: (categoryName: string) => void;
  clearSelectedCategory: () => void;
  toggleCategory: (categoryName: string) => void;
  setTopCategory: (category: string) => void;

  getSelectedCategory: () => Category | null;
  isCategorySelected: (categoryName: string) => boolean;
}

const defaultCategories: Category[] = [
  {
    id: "1",
    name: "단과대학",
    icon: "ri-service-fill",
    color: "bg-red-100 text-red-600",
  },
  {
    id: "2",
    name: "총학생회",
    icon: "ri-service-fill",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "3",
    name: "총동아리",
    icon: "ri-service-fill",
    color: "bg-orange-100 text-orange-600",
  },

  {
    id: "4",
    name: "음식점",
    icon: "ri-restaurant-fill",
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "5",
    name: "카페",
    icon: "ri-cup-fill",
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: "6",
    name: "주점",
    icon: "ri-beer-fill",
    color: "bg-green-100 text-green-600",
  },
  {
    id: "7",
    name: "기타",
    icon: "ri-shopping-bag-fill",
    color: "bg-blue-100 text-blue-600",
  },
];

export const useCategoryStore = create<CategoryState>()(
  devtools(
    (set, get) => ({
      selectedCategoryId: "",
      selectedCategoryName: "default", // 기본값: "" (단과대학 선택됨)
      categories: defaultCategories,

      // 카테고리 선택 - "단과대학"은 ""로 처리
      setSelectedCategory: (categoryName: string) => {
        const finalCategory = categoryName === "단과대학" ? "" : categoryName;
        set(
          { selectedCategoryName: finalCategory },
          false,
          "setSelectedCategory"
        );
      },

      // 카테고리 선택 해제 - 기본값(단과대학)으로 돌아감
      clearSelectedCategory: () =>
        set({ selectedCategoryName: "" }, false, "clearSelectedCategory"),

      // 카테고리 토글 - "단과대학"은 ""로 처리
      toggleCategory: (categoryName: string) => {
        const { selectedCategoryName } = get();

        // "단과대학"을 클릭한 경우
        if (categoryName === "단과대학") {
          // 현재 ""(단과대학 선택됨)이면 해제는 하지 않음 (항상 하나는 선택되어야 함)
          // 또는 다른 게 선택되어 있으면 ""로 변경(단과대학 선택)
          if (selectedCategoryName !== "") {
            set({ selectedCategoryName: "" }, false, "toggleCategory");
          }
        } else {
          // 다른 카테고리를 클릭한 경우
          // 이미 선택된 카테고리를 다시 클릭하면 단과대학("")으로 돌아감
          set(
            {
              selectedCategoryName:
                selectedCategoryName === categoryName ? "" : categoryName,
            },
            false,
            "toggleCategory"
          );
        }
      },
      setTopCategory: (category) => set({ topCategory: category }),

      // 선택된 카테고리 객체 반환
      getSelectedCategory: () => {
        const { selectedCategoryName, categories } = get();

        // ""이면 "단과대학" 반환
        if (selectedCategoryName === "") {
          return categories.find((cat) => cat.name === "단과대학") || null;
        }

        return (
          categories.find((cat) => cat.name === selectedCategoryName) || null
        );
      },

      // 카테고리 선택 여부 확인
      isCategorySelected: (categoryName: string) => {
        const { selectedCategoryName } = get();

        // "단과대학"인 경우 ""와 비교
        if (categoryName === "단과대학") {
          return selectedCategoryName === "";
        }

        return selectedCategoryName === categoryName;
      },
    }),
    {
      name: "category-store",
    }
  )
);
