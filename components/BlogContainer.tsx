/**
 * @summary A container for blog content - world's simplest Component
 * @param children contained JSX components
 * @returns A div
 */
export default function BlogContainer({ children }) {
  /**
   * The className property is a special React property that allows you to set the class attribute of the rendered HTML element.
   * It's a mystery why the class attribute is called className in React, but it is.
   * You can use CSS classes from a css file for example. However, this project uses Tailwind CSS, which is a utility-first CSS framework.
   * So you almost never define custom CSS, you just use the classes that Tailwind provides.
   * The classes are defined in the tailwind.config.js file.
   * In this case we have:
   * - container: a class that sets the max-width of the container to 100% of the parent element
   * - mx-auto: a class that sets the left and right margins to auto, centering the container
   * - px-5: a class that sets the padding on the left and right to 1.25rem
   * - bg-[#F2F0EA]: a class that sets the background color to a light grey
   */
  return <div className="container mx-auto px-5 bg-[#F2F0EA]">{children}</div>
}
