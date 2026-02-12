import * as React from "react";
import Link, { LinkProps } from "next/link";

type CustomLinkProps = LinkProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    className?: string;
  };

export const NavLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(
  function CustomLink({ className, children, ...props }, ref) {
    return (
      <Link
        ref={ref}
        className={`rounded px-2 py-1 hover:bg-black/5 ${className}`}
        {...props}
      >
        {children}
      </Link>
    );
  },
);
