import { Container } from "@nextui-org/react"
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export const Layout = ({ children }: Props) => {
    return (
        <Container>
            {children}
        </Container>
    )
}