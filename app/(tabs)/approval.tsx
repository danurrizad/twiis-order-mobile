import { View, Text, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronDown, faX } from '@fortawesome/free-solid-svg-icons';
import { RadioButton } from 'react-native-paper';

function ApprovalView() {
  const [showModal, setShowModal] = useState(false)
    const [status, setStatus] = useState('waitApprove')
    const [date, setDate] = useState({
      start: "",
      end: ""
    })
  
    useEffect(()=>{
      setShowModal(false)
    }, [status])
  return (
    <ScrollView style={{ backgroundColor: "white", paddingHorizontal: 12}}>
      <View>
        <Modal 
          isVisible={showModal}
          onBackdropPress={() => setShowModal(false)}
          style={{ justifyContent: 'flex-end', margin: 0 }} // Align modal at the bottom
        >
          <View style={{ height: 200, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
            <View style={{ flexDirection: "row", gap: 12, alignItems: "center", paddingBottom: 10}}>
              <Pressable onPress={() => setShowModal(false)}>
                <FontAwesomeIcon icon={faX}/>
              </Pressable>
              <Text style={{ fontSize: 16, fontWeight: 'bold'}}>Filter by status</Text>
            </View>
            <View style={{ borderTopWidth: 1, paddingTop: 10}}>
              <Pressable onPress={() => setStatus('waitApproval')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>Waiting Approval</Text>
                <RadioButton
                  value="waitApproval"
                  status={ status === 'waitApproval' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('waitApproval')}
                  color='#003399'
                  />
              </Pressable>
              <Pressable onPress={() => setStatus('approved')} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 16, }}>Approved</Text>
                <RadioButton
                  value="approved"
                  status={ status === 'approved' ? 'checked' : 'unchecked' }
                  onPress={() => setStatus('approved')}
                  color='#003399'
                  />
              </Pressable>
            
            
            </View>
          </View>
        </Modal>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10}}>
          <Pressable style={{ backgroundColor: "#003399", padding: 5, width: 170, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between"}} onPress={()=>setShowModal(!showModal)}>
            <Text style={{ color: "white"}}>
              {
                status === "waitApproval" ? "Waiting Approval" :
                status === "approved" ? "Approved" : 
                "Waiting Approval" 
              }
            </Text>
            <FontAwesomeIcon icon={faChevronDown} color={status === "all" ? "black" : "white"}/>
          </Pressable>
          <Pressable style={{ backgroundColor: "#F2F4F8", padding: 5, width: 170, borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between"}} onPress={()=>setShowModal(!showModal)}>
            <Text style={{ color: "black"}}>All period</Text>
            <FontAwesomeIcon icon={faChevronDown}/>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

export default ApprovalView