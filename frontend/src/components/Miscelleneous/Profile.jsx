import React from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Text,
    Button,
    Avatar
  } from '@chakra-ui/react'
export default function Profile({user,children}) {
 
        const OverlayOne = () => (
    <ModalOverlay
      bg='blackAlpha.300'
      backdropFilter='blur(5px) '
    />
  )

  const OverlayTwo = () => (
    <ModalOverlay
      bg='none'
      backdropFilter='auto'
      backdropInvert='20%'
      backdropBlur='2px'
    />
  )

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [overlay, setOverlay] = React.useState(<OverlayOne />)

  return (
    <>
      
      <Text
        onClick={() => {
          setOverlay(<OverlayTwo />)
          onOpen()
        }}
        cursor={'pointer'}
      >
        {children}
      </Text>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent display={'flex'} h={'40%'} alignItems={'center'} justifyContent={'space-around'}>
          <ModalCloseButton />
          <ModalBody display={'flex'} flexDirection={'column'} alignItems={'center'} justifyContent={'center'}>
            <Avatar size={'2xl'} name={'P D'} src={user && user.pic}/>
          <ModalHeader>{user && user.name}</ModalHeader>
          <Text>{user && user.email}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
  
}
