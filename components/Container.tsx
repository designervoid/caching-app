import { Container as ContainerNextUI } from "@nextui-org/react";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export const Container = ({ children }: Props) => {
    return <ContainerNextUI fluid>{children}</ContainerNextUI>
}