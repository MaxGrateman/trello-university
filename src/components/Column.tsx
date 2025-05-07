import { useDrag, useDrop } from 'react-dnd';
import { useRef } from 'react';

type ColumnProps = {
  column: any;
  index: number;
  moveColumn: (from: number, to: number) => void;
  children: React.ReactNode;
};

const ItemType = 'COLUMN';

function Column({ column, index, moveColumn, children }: ColumnProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`bg-white rounded shadow p-3 min-w-[250px] space-y-2 opacity-${
        isDragging ? '40' : '100'
      }`}
    >
      {children}
    </div>
  );
}

export default Column;
