import { useState } from "react";
import EllipsisIcon from "./icons/ellipsis-icon";
import { relative } from "path";

interface EllipsisHandlerProps {
  id: number;
  type: ItemType;
}
type ItemType = "folder" | "file";
export default function EllipsisHandler({ id, type }: EllipsisHandlerProps) {
  const [toggle, setToggle] = useState(false);
  return (
    <div className="ellipsis-container">
      <div
        className="ellipsis"
        onClick={(e) => {
          e.stopPropagation;
          setToggle((prev) => !prev);
        }}
      >
        <EllipsisIcon />
      </div>
      {toggle && (
        <div className="pop-up">
          <div className="edit-buttons-container">
            <div className="rename-button">Rename</div>
            <div className="delete-button">Delete</div>
          </div>
        </div>
      )}
    </div>
  );
}
