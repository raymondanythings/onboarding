import { FrontMatterType } from "@/types/post.type";
import { readFileSync, readdirSync } from "fs";
import matter from "gray-matter";
import path from "path";

const filePath = path.join("src", "__posts");
export const getAllPosts = async () => {
  const posts = readdirSync(filePath)
    .filter((file) => file.endsWith("md") || file.endsWith("mdx"))
    .map((post) => {
      const contents = readFileSync(path.join(filePath, post), "utf-8");
      const result = matter(contents);
      return {
        ...result,
        data: result.data as FrontMatterType,
        fileName: post,
      };
    });
  return posts;
};

export const getPostByFileName = async (fileName: string) => {
  const file = path.join("src", "__posts", fileName);
  const post = readFileSync(file, "utf-8");
  const content = matter(post);
  return { ...content, data: content.data as FrontMatterType };
};
